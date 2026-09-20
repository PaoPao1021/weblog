import { test, expect } from '@playwright/test';
import repositories from '../../src/data/github-repositories.json' with { type: 'json' };

test('language persists and translated notes keep their deep links', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '切换为中文' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page).toHaveTitle('PaoPao1021 — 个人空间');
  await expect(page.getByRole('heading', { name: '我是 PaoPao1021。' })).toBeVisible();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('为专注而设计');
  await page.getByRole('combobox').press('Enter');
  await expect(page).toHaveURL(/#\/notes\/designing-for-focus$/);
  await expect(page.getByRole('heading', { name: '界面也有新陈代谢' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: '界面也有新陈代谢' })).toBeVisible();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('系统');
  await page.getByRole('combobox').press('Enter');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('PaoPao1021 — Personal OS');
  await expect(page).toHaveURL(/#\/system$/);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'The interface has a metabolism' })).toBeVisible();
});

test('GitHub profile and public repository links use real destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('main').getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/PaoPao1021');
  await page.getByRole('main').getByRole('button', { name: 'Projects', exact: true }).click();
  await expect(page.getByRole('link', { name: 'GitHub profile', exact: true })).toHaveAttribute('href', 'https://github.com/PaoPao1021');
  for (const repo of repositories) {
    const link = page.locator('.repository-row').filter({ has: page.getByText(repo.name, { exact: true }) });
    await expect(link).toHaveAttribute('href', repo.url);
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await expect(page.locator('.repository-row').filter({ hasText: 'Asterline' })).toContainText('Fork');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Chinese browser preference is applied without saved settings', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'zh-CN' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('button', { name: 'Switch to English' })).toBeVisible();
  await context.close();
});
