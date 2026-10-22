
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test('API E2E - Create, Read, Update and Delete Post', async ({
    request,
}) => {
    // 1. CREATE a post
    const createResponse = await request.post(`${BASE_URL}/posts`, {
        data: {
            title: 'Playwright E2E Test',
            body: 'API automation using Playwright',
            userId: 1,
        },
    });

    expect(createResponse.status()).toBe(201);

    const createdPost = await createResponse.json();
    expect(createdPost.title).toBe('Playwright E2E Test');

    // Use an existing post for the remaining operations.
    const postId = 1;

    // 2. READ an existing post
    const getResponse = await request.get(`${BASE_URL}/posts/${postId}`);

    expect(getResponse.status()).toBe(200);

    const fetchedPost = await getResponse.json();
    expect(fetchedPost.id).toBe(postId);
    expect(fetchedPost.title).toBeTruthy();

    // 3. UPDATE the existing post
    const updateResponse = await request.put(
        `${BASE_URL}/posts/${postId}`,
        {
            data: {
                id: postId,
                title: 'Updated Playwright E2E Test',
                body: 'Updated API test data',
                userId: 1,
            },
        }
    );

    expect(updateResponse.status()).toBe(200);

    const updatedPost = await updateResponse.json();
    expect(updatedPost.title).toBe('Updated Playwright E2E Test');
    expect(updatedPost.body).toBe('Updated API test data');

    // 4. DELETE the existing post
    const deleteResponse = await request.delete(
        `${BASE_URL}/posts/${postId}`
    );

    expect(deleteResponse.status()).toBe(200);

    console.log('API E2E test completed successfully');
});