import { mkdir } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

test('navigation stays inside the viewport and mobile labels stay inside the dock', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'This test supplies its own viewport matrix.');
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  const capture = process.env.CAPTURE_SCREENSHOTS === '1';
  if (capture) await mkdir('docs/screenshots', { recursive: true });

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 1024 ? 844 : 1000 });
    await page.goto('/');
    await expect(page.locator('.hero-inner')).toHaveCSS('opacity', '1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const dock = page.getByRole('navigation', { name: 'Application dock' });
    const bounds = (await dock.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    if (width < 1024) {
      for (const label of await dock.locator('.dock-label').all()) {
        const labelBounds = (await label.boundingBox())!;
        expect(labelBounds.y).toBeGreaterThanOrEqual(bounds.y);
        expect(labelBounds.y + labelBounds.height).toBeLessThanOrEqual(bounds.y + bounds.height);
      }
    }
    if (capture && (width === 390 || width === 1440)) {
      await page.screenshot({ path: `docs/screenshots/${width === 390 ? 'mobile' : 'desktop'}-light.png` });
    }
  }
  await page.getByRole('main').getByRole('button', { name: 'Projects' }).click();
  await page.getByText('Interface studies', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Read project Project One' })).toBeVisible();
  if (capture) await page.screenshot({ path: 'docs/screenshots/projects-light.png' });
  await page.getByRole('navigation', { name: 'Application dock' }).getByRole('button', { name: 'Home', exact: true }).click();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  if (capture) await page.screenshot({ path: 'docs/screenshots/desktop-dark.png' });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/notes/designing-for-focus');
  await expect(page.getByRole('heading', { name: 'Designing for focus, not attention' })).toBeVisible();
  if (capture) await page.screenshot({ path: 'docs/screenshots/mobile-note.png' });
});
