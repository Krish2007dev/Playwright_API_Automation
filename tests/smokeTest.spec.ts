import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';
import { createToken } from '../helpers/createToken';
import { validateSchema } from '../utils/schema-validator';




test('Get Articles', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(response).shouldMatchSchema('article', 'GET_article')
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10)

})

test('Get Tag Test', async ({ api }) => {
    const response = await api
        .path('/tags')
        .clearAuth()
        .getRequest(200)
    await expect(response).shouldMatchSchema('tags', 'GET_tags', true)
    expect(response.tags[0]).shouldEqual('Test')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)
});



test('Create and Delete Article', async ({ api }) => {
    const createArticleRespons = await api
        .path('/articles/')
        .body({ "article": { "title": "Test732222", "description": "Test1 desc", "body": "Tetst data", "tagList": [] } })
        .postRequest(201)
    await expect(createArticleRespons).shouldMatchSchema('create_article', 'POST_tags')
    expect(createArticleRespons.article.title).shouldEqual('Test732222');
    const slugId = createArticleRespons.article.slug

    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articleResponse.articles[0].title).shouldEqual('Test732222')

    await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204)

    const articleResponse2 = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articleResponse2.articles[0].title).not.shouldEqual('Test732222')

})

test('Create,Update and Delete Article', async ({ api }) => {
    const createArticleRespons = await api
        .path('/articles/')
        .body({ "article": { "title": "Test732222", "description": "Test1 desc", "body": "Tetst data", "tagList": [] } })
        .postRequest(201)
    expect(createArticleRespons.article.title).shouldEqual('Test732222');
    const slugId = createArticleRespons.article.slug

    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articleResponse.articles[0].title).shouldEqual('Test732222')

    const updateArticleResponse = await api

        .path(`/articles/${slugId}`)
        .body({ "article": { "title": "TestNew", "description": "Test1 desc", "body": "Tetst data", "tagList": [] } })
        .putRequest(200)
    expect(updateArticleResponse.article.title).shouldEqual('TestNew');
    const updatedSlugId = updateArticleResponse.article.slug;



    await api
        .path(`/articles/${updatedSlugId}`)
        .deleteRequest(204)

    const articleResponse2 = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articleResponse2.articles[0].title).not.shouldEqual('TestNew')

})