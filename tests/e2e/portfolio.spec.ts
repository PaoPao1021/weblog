import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home, project reading and deep-link refresh', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: "I'm PaoPao1021." })).toBeVisible();
  await page.getByRole('main').getByRole('button', { name: 'Projects' }).click();
  await expect(page.getByRole('dialog', { name: 'Projects', exact: true })).toBeVisible();
  await page.getByText('Interface studies', { exact: true }).click();
  await page.locator('a,button').filter({ hasText: 'Project One' }).first().click();
  await expect(page).toHaveURL(/#\/projects\/project-one/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Overview', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('command palette opens notes and theme persists', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /open command palette/i }).click();
  const search = page.getByRole('combobox');
  await search.fill('Designing for focus');
  await search.press('Enter');
  await expect(page).toHaveURL(/#\/notes\/designing-for-focus/);
  await expect(page.getByRole('heading', { name: 'Designing for focus, not attention' })).toBeVisible();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('Dark theme');
  await page.getByRole('combobox').press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('terminal commands and home preserve minimized session', async ({ page }) => {
  await page.goto('/#/terminal');
  const input = page.getByRole('textbox');
  await input.fill('sudo hire-me'); await input.press('Enter');
  await expect(page.getByText('Permission granted.', { exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Application dock' }).getByRole('button', { name: 'Home', exact: true }).click();
  await page.getByRole('navigation', { name: 'Application dock' }).getByRole('button', { name: 'Terminal', exact: true }).click();
  await expect(page.getByText('Permission granted.', { exact: true })).toBeVisible();
  await input.fill('clear'); await input.press('Enter');
  await expect(page.getByText('Permission granted.', { exact: true })).toHaveCount(0);
  await input.press('ArrowUp'); await expect(input).toHaveValue('clear');
});

test('unknown note can return to the garden', async ({ page }) => {
  await page.goto('/#/notes/missing');
  await expect(page.getByRole('dialog', { name: 'Notes', exact: true })).toBeVisible();
  await expect(page.getByText(/not found|not exist|couldn.t find|isn.t here/i).first()).toBeVisible();
  await page.getByRole('button', { name: /back to notes/i }).click();
  await expect(page).toHaveURL(/#\/notes$/);
});

test('desktop windows can move, minimize and restore', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Free windows are a desktop interaction.');
  await page.goto('/#/projects');
  const projects = page.getByRole('dialog', { name: 'Projects', exact: true });
  await expect(projects).toBeVisible();
  const title = projects.locator('.window-title');
  const before = await projects.boundingBox();
  await title.focus(); await title.press('ArrowRight');
  await expect.poll(async () => (await projects.boundingBox())!.x).toBeGreaterThan(before!.x);
  await page.getByRole('navigation', { name: 'Application dock' }).getByRole('button', { name: 'Notes', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Notes', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Minimize Notes' }).click();
  await expect(page.getByRole('dialog', { name: 'Notes', exact: true })).toHaveCount(0);
  await expect(projects).toHaveClass(/is-active/);
  await page.getByRole('navigation', { name: 'Application dock' }).getByRole('button', { name: 'Notes', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Notes', exact: true })).toBeVisible();
});

test('visible home, reading, and search pass accessibility checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const hash of ['', '#/notes/working-with-ai-as-material', '#/system']) {
    await page.goto(`/${hash}`);
    if (hash) await expect(page.locator('.glass-window.is-active')).toBeVisible();
    await expect(page.locator('.hero-inner')).toHaveCSS('opacity', '1');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  }
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.locator('.command-overlay')).toHaveCSS('opacity', '1');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});
