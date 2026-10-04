import { test, expect } from '@playwright/test';

test('header theme control cycles preferences and persists the selection', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Theme: system. Switch to light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Theme: light. Switch to dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await page.getByRole('button', { name: 'Theme: dark. Switch to system' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('closing the lazy-loaded palette restores the original input focus', async ({ page }) => {
  await page.goto('/#/terminal');
  const input = page.getByRole('textbox', { name: 'Terminal command' });
  await input.focus();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('combobox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toHaveCount(0);
  await expect(input).toBeFocused();
});

test('palette navigation keeps focus and route in the destination window', async ({ page }) => {
  await page.goto('/#/terminal');
  await page.getByRole('textbox', { name: 'Terminal command' }).focus();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('Designing for focus');
  await page.getByRole('combobox').press('Enter');
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toHaveCount(0);
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const notes = page.getByRole('dialog', { name: 'Notes', exact: true });
  await expect(notes).toHaveClass(/is-active/);
  await expect(page).toHaveURL(/#\/notes\/designing-for-focus$/);
  await expect(notes).toBeFocused();
});

test('palette close button works with Tab and Enter and returns focus', async ({ page }) => {
  await page.goto('/#/terminal');
  const terminal = page.getByRole('textbox', { name: 'Terminal command' });
  await terminal.focus();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('combobox')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close command palette' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toHaveCount(0);
  await expect(terminal).toBeFocused();
  await expect(page).toHaveURL(/#\/terminal$/);
});

test('terminal completion allows keyboard users to leave the input', async ({ page }) => {
  await page.goto('/#/terminal');
  const input = page.getByRole('textbox', { name: 'Terminal command' });
  await input.fill('he');
  await input.press('Tab');
  await expect(input).toHaveValue('help');
  await expect(input).toBeFocused();
  await input.press('Tab');
  await expect(input).not.toBeFocused();
  await input.fill('he');
  await input.press('Shift+Tab');
  await expect(input).not.toBeFocused();
  await expect(input).toHaveValue('he');
  await input.fill('');
  await input.press('Tab');
  await expect(input).not.toBeFocused();
});
