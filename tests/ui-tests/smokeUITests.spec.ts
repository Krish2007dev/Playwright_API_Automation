import { test, expect, request } from '@playwright/test'

test('create test', async ({ page }) => {
    page.goto('https://conduit.bondaracademy.com/login')
    await page.getByText('Sign in').click()
    await page.getByText('Need an account?').isVisible()
    await page.getByRole('textbox', { name: 'Email' })
    await page.getByRole('textbox', { name: 'Password' })
    await page.getByRole('button', { name: ' Sign in ' }).click()
    await page.getByText('New Article').click()
    await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is awesome')
    await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('About Playwright')
    await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('we like to use playwright for ui automation')
    await page.getByRole('textbox', { name: ' Publish Article ' }).click()
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await page.getByRole('heading', { name: 'Playwright is awesome' }).click()
    await page.getByRole('button', { name: 'Delete Article' }).click()
})