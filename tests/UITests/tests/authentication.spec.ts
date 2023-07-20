import { test, expect } from '@playwright/test';
import { validUser, invalidUsers } from '../data/authenticationData';
import { baseURL } from '../data/config';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});


test('valid login', async ({ page }) => {
  await page.locator("#log-in__username").fill(validUser.username);
  await page.locator("#log-in__password").fill(validUser.password);
  await page.locator(".log-in__button").click();

  await expect(page).toHaveURL(/viikon-tulokset/);
});


for (const invalidUser of invalidUsers) {
  test(`invalid login ${invalidUser.username}`, async ({ page }) => {
    await page.locator("#log-in__username").fill(validUser.username);
    await page.locator("#log-in__password").fill(validUser.password);
    await page.locator(".log-in__button").click();
  
    await expect(page.locator(".log-in__button")).toBeAttached();
    await expect(page).not.toHaveURL(/viikon-tulokset/);
  });
}


test('redirect to login page', async ({ page }) => {
  await page.goto('/viikon-tulokset');
  await expect(page).not.toHaveURL(baseURL + '/viikon-tulokset');
  await expect(page).not.toHaveURL(baseURL + '/');
});

test(`k`, async ({ page }) => {
  await page.locator("#log-in__username").fill(validUser.username);
  await page.locator("#log-in__password").fill(validUser.password);
  await page.locator(".log-in__button").click();

  await expect(page.locator(".log-in__button")).toBeAttached();
  await expect(page).not.toHaveURL(baseURL + '/viikon-tulokset');
  await expect(page).toHaveURL(baseURL + '/');
  const a = await page.locator('.log-in__button').count();
  a;
  const b = await page.locator('.log-in__button').isVisible();
  b;
  const c = await page.locator('.log-in__butttttton').isVisible();
  c;
  await expect(page.locator(".log-in__button")).toBeAttached();
  await expect(page.locator(".log-in__button")).not.toBeAttached();
});
  