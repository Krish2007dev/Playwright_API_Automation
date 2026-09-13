import { faker } from '@faker-js/faker';
import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { getNewRandomArticle } from '../../utils/data.genrator';

test('HAR Flow - Article lifecycle with public and authenticated requests', async ({ api }) => {
  

    const articleRequest = getNewRandomArticle()
    const createArticleResponse = await api
        .path('/articles/')
        .body(articleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles', true)
    const articleSlug = createArticleResponse.article.slug

    const articleResponse = await api
        .path(`/articles/${articleSlug}`)
        .getRequest(200)
    await expect(articleResponse).shouldMatchSchema('articles', 'GET_articles_article', true)

    const commentsResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200)
    await expect(commentsResponse).shouldMatchSchema('articles', 'GET_articles_comments', true)

    const commentRequest = {
        comment: {
            body: faker.lorem.sentence(6)
        }
    }
    const createCommentResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .body(commentRequest)
        .postRequest(200)
    await expect(createCommentResponse).shouldMatchSchema('articles', 'POST_articles_comments', true)
    const commentId = createCommentResponse.comment.id

    await api
        .path(`/articles/${articleSlug}`)
        .deleteRequest(204)

    const finalArticlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(finalArticlesResponse).shouldMatchSchema('articles', 'GET_articles', true)

    void commentId
})