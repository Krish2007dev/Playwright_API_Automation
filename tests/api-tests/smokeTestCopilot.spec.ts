import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import articleRequestPayload from '../../request-objects/POST-article.json';
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../../utils/data.genrator';




test('Get Articles', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
        console.log(response)
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
    // const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
    // articleRequest.article.title = "This is object title"

    const articleRequest = getNewRandomArticle()
    const createArticleRespons = await api
        .path('/articles/')
        .body(articleRequest)
        .postRequest(201)
    await expect(createArticleRespons).shouldMatchSchema('create_article', 'POST_tags')
    expect(createArticleRespons.article.title).shouldEqual(articleRequest.article.title);
    const slugId = createArticleRespons.article.slug

    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articleResponse).shouldMatchSchema('articles', 'GET_articles', true)
    expect(articleResponse.articles[0].title).shouldEqual(articleRequest.article.title)

    await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204)

    const articleResponse2 = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articleResponse2).shouldMatchSchema('articles', 'GET_articles', true)
    expect(articleResponse2.articles[0].title).not.shouldEqual(articleRequest.article.title)

})

test('Create,Update and Delete Article', async ({ api }) => {
    const articleTitle = faker.lorem.sentence(5)
     const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
    articleRequest.article.title =  articleTitle

    const createArticleRespons = await api
        .path('/articles/')
        .body(articleRequest)
        .postRequest(201)
    await expect(createArticleRespons).shouldMatchSchema('articles', 'POST_articles', true)
    expect(createArticleRespons.article.title).shouldEqual(articleTitle);
    const slugId = createArticleRespons.article.slug

    

    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articleResponse).shouldMatchSchema('articles', 'GET_articles', true)
    expect(articleResponse.articles[0].title).shouldEqual(articleTitle)


    const articleTitle2 = faker.lorem.sentence(5)
     articleRequest.article.title = articleTitle2

    const updateArticleResponse = await api

        .path(`/articles/${slugId}`)
        .body(articleRequest)
        .putRequest(200)
    await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_articles', true)
    expect(updateArticleResponse.article.title).shouldEqual(articleTitle2);
    const updatedSlugId = updateArticleResponse.article.slug;



    await api
        .path(`/articles/${updatedSlugId}`)
        .deleteRequest(204)

    const articleResponse2 = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articleResponse2).shouldMatchSchema('articles', 'GET_articles', true)
    expect(articleResponse2.articles[0].title).not.shouldEqual(articleTitle2)

})