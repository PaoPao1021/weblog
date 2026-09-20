import { test, expect } from '@playwright/test';

test('desktop widget renders, switches tabs, and persists scratchpad', async ({ page }) => {
  await page.goto('/');

  // Widget should be present
  const widget = page.getByRole('complementary', { name: /desktop widget|桌面灵动小组件/i });
  await expect(widget).toBeVisible();

  // Test Lo-Fi player tab
  await page.getByRole('button', { name: /lo-fi player|氛围伴侣/i }).click();
  await expect(page.locator('.vinyl-turntable-container')).toBeVisible();

  // Test Focus Pomodoro tab
  await page.getByRole('button', { name: /focus timer|专注计时器/i }).click();
  await expect(page.locator('.pomo-dial-wrap')).toBeVisible();
  const startBtn = page.getByRole('button', { name: /start|开始/i });
  await expect(startBtn).toBeVisible();
  await startBtn.click();
  await expect(page.getByRole('button', { name: /pause|暂停/i })).toBeVisible();

  // Test Quick Scratchpad tab
  await page.getByRole('button', { name: /quick scratchpad|随想速记/i }).click();
  const textarea = page.getByPlaceholder(/jot down a quick thought|记下零散的想法/i);
  await expect(textarea).toBeVisible();
  await textarea.fill('Testing personal OS desktop scratchpad');
  await page.reload();

  // Switch back to scratchpad and verify persisted content
  await page.getByRole('button', { name: /quick scratchpad|随想速记/i }).click();
  await expect(textarea).toHaveValue('Testing personal OS desktop scratchpad');
});

test('desktop right click opens context menu and can open command palette', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop right click is a desktop mouse interaction.');
  await page.goto('/');

  // Right-click empty wallpaper
  await page.locator('.desktop-base').click({ button: 'right', position: { x: 100, y: 120 } });
  const contextMenu = page.getByRole('menu', { name: /desktop context menu|桌面快捷菜单/i });
  await expect(contextMenu).toBeVisible();

  // Click explore from context menu
  await contextMenu.getByRole('menuitem', { name: /explore/i }).click();
  await expect(contextMenu).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
});
