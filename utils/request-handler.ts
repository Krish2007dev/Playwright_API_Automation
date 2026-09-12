import { APIRequestContext } from "@playwright/test"
import { expect } from '@playwright/test';
import { APILogger } from "./logger";
import { test } from '@playwright/test';

export class RequestHandler {

    private request: APIRequestContext
    private logger: APILogger

    private baseUrl: string | undefined
    private defaultBaseurl: string
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}
    private defaultAuthToken: string
    private clearAuthFlag = false


    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger, authToken: string = '') {
        this.request = request
        this.defaultBaseurl = apiBaseUrl
        this.logger = logger
        this.defaultAuthToken = authToken
    }


    url(url: string) {
        this.baseUrl = url
        return this
    }
    path(path: string) {
        this.apiPath = path
        return this
    }
    params(params: object) {
        this.queryParams = params
        return this
    }
    headers(headers: Record<string, string>) {
        this.apiHeaders = headers
        return this
    }
    body(body: object) {
        this.apiBody = body
        return this
    }

    clearAuth() {
        this.clearAuthFlag = true
        return this
    }

    async getRequest(statusCode: number) {
        let responseJson: any

        const url = this.getUrl()

        await test.step(`GET request to: ${url}`, async () => {
            this.logger.logRequest('GET', url, this.getHeaders())
            const reponse = await this.request.get(url, {
                headers: this.getHeaders()

            })

            this.cleanupFields()

            const actualStatus = reponse.status()
            responseJson = await reponse.json()
            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statusCode, this.getRequest)

        })


        return responseJson

    }

    async postRequest(statusCode: number) {
        let responseJson: any

        const url = this.getUrl()
        await test.step(`POST request to: ${url}`, async () => {
            this.logger.logRequest('POST', url, this.getHeaders(), this.apiBody)
            const reponse = await this.request.post(url, {
                headers: this.getHeaders(),
                data: this.apiBody

            })

            this.cleanupFields()

            const actualStatus = reponse.status()

            responseJson = await reponse.json()
            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statusCode, this.postRequest)

        })
        return responseJson

    }

    async putRequest(statusCode: number) {
        let responseJson: any
        const url = this.getUrl()

        await test.step(`PUT request to: ${url}`, async () => {

            this.logger.logRequest('PUT', url, this.getHeaders(), this.apiBody)
            const reponse = await this.request.put(url, {
                headers: this.getHeaders(),
                data: this.apiBody

            })
            this.cleanupFields()

            const actualStatus = reponse.status()
            responseJson = await reponse.json()
            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
        })

        return responseJson

    }

    async deleteRequest(statusCode: number) {

        const url = this.getUrl()
        await test.step(`POST request to: ${url}`, async () => {
this.logger.logRequest('DELETE', url, this.getHeaders())
        const reponse = await this.request.delete(url, {
            headers: this.getHeaders()

        })
        this.cleanupFields()
        const actualStatus = reponse.status()
        this.logger.logResponse(actualStatus)
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
        })


        

    }


    getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseurl}${this.apiPath}`)

        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }
        return url.toString()
    }


    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if (actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLog()
            const error = new Error(`Expected status ${expectedStatus} but got ${actualStatus}\n\nRecent API Activity:\n${logs}`)
            Error.captureStackTrace(error, callingMethod);
            throw error;
        }
    }

    private getHeaders() {
        if (!this.clearAuthFlag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthToken
        }
        return this.apiHeaders
    }



    private cleanupFields() {
        this.apiBody = {}
        this.apiHeaders = {}
        this.baseUrl = undefined
        this.apiPath = ''
        this.queryParams = {}
        this.clearAuthFlag = false
    }
}