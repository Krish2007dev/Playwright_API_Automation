import { test, expect, request } from '@playwright/test';

let authToken: string

test.beforeAll('Run Before all',async({request})=>{
const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": { "email": "ankitkarmilkar@gmail.com", "password": "Virat@1996" }
    }
  });
  const loginresponse = await response.json();
  
   authToken = 'Token ' + loginresponse.user.token;

})

test.afterAll('Run After all',async({})=>{
  console.log("This is executed After ALL");
})

test('Get Test Tags', async ({ request }) => {

  const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const tagResponseJson = await response.json();
  expect(response.status()).toEqual(200);
  expect(tagResponseJson.tags[0]).toEqual('Test');
  expect(tagResponseJson.tags.length).toBeLessThanOrEqual(10)
  console.log(tagResponseJson);

});
test('Get Test Articles', async ({ request }) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResponseJson = await response.json();
  console.log(articlesResponseJson);
  expect(response.status()).toEqual(200);
  expect(articlesResponseJson.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJson.articlesCount).toEqual(10);
  console.log(articlesResponseJson);

})

test('Create and Delete Article', async ({ request }) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Test732222",
        "description": "Test1 desc",
        "body": "Tetst data",
        "tagList": []
      }
    },
    headers: {
      authorization: authToken
    }

  })
  const articleResponseJson = await response.json();
  //console.log(articleResponseJson);
  expect(response.status()).toEqual(201);
  expect(articleResponseJson.article.title).toEqual('Test732222');
  const getresponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      authorization: authToken
    }
  })
  const articlesResponseJson = await getresponse.json();
  expect(articlesResponseJson.articles[0].title).toEqual('Test732222')

  const slugId = articlesResponseJson.articles[0].slug
  console.log(slugId);

 const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      authorization: authToken
    }

  })
expect(deleteResponse.status()).toEqual(204);


})

test('Create,Update Delete Article', async ({ request }) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Test5553",
        "description": "Test1 desc",
        "body": "Tetst data",
        "tagList": []
      }
    },
    headers: {
      authorization: authToken
    }

  })
  const articleResponseJson = await response.json();
  //console.log(articleResponseJson);
  expect(response.status()).toEqual(201);
  expect(articleResponseJson.article.title).toEqual('Test5553');
  const getresponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      authorization: authToken
    }
  })
  const articlesResponseJson = await getresponse.json();
  expect(articlesResponseJson.articles[0].title).toEqual('Test5553')

  const slugId = articlesResponseJson.articles[0].slug
  console.log(slugId);


const updateArticleResponse = await request.put(
  `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
  {
    headers: {
      authorization: authToken
    },
    data: {
      article: {
        title: 'Test9933',
        description: 'Test1 desc date',
        body: 'Tetst data',
        tagList: [],
        slug: slugId
      }
    }
  }
);

const updateArticleResponseJson = await updateArticleResponse.json();
const updatedSlugId = updateArticleResponseJson.article.slug;

expect(updateArticleResponse.status()).toEqual(200);
expect(updateArticleResponseJson.article.title).toEqual('Test9933');


 const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedSlugId}`, {
    headers: {
      authorization: authToken
    }

  })
expect(deleteResponse.status()).toEqual(204);

});