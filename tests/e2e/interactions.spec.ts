import { test, expect } from '@playwright/test';

test('desktop pointer feedback settles and does not move neighboring click targets', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop pointer interaction only.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const dock = page.getByRole('navigation', { name: 'Application dock' });
  const projects = dock.getByRole('button', { name: 'Projects', exact: true });
  const terminal = dock.getByRole('button', { name: 'Terminal', exact: true });
  const original = (await projects.boundingBox())!;
  const terminalBefore = (await terminal.boundingBox())!;
  await projects.hover();
  await expect.poll(async () => (await projects.boundingBox())!.width).toBeGreaterThan(original.width + 2);
  expect((await terminal.boundingBox())!.x).toBeCloseTo(terminalBefore.x, 0);
  await page.mouse.move(5, 5);
  await expect.poll(async () => Math.abs((await projects.boundingBox())!.width - original.width)).toBeLessThan(.15);
  await projects.click();
  await expect(page.getByRole('dialog', { name: 'Projects', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close Projects', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Projects', exact: true })).toHaveCount(0);
});

test('reduced motion disables decorative pointer movement while controls remain functional', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop pointer interaction only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const button = page.getByRole('main').getByRole('button', { name: 'Notes', exact: true });
  const before = (await button.boundingBox())!;
  await button.hover();
  const after = (await button.boundingBox())!;
  expect(after.x).toBeCloseTo(before.x, 1);
  expect(after.y).toBeCloseTo(before.y, 1);
  expect(after.width).toBeCloseTo(before.width, 1);
  await button.click();
  await expect(page.getByRole('dialog', { name: 'Notes', exact: true })).toBeVisible();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('GitHub');
  await expect(page.getByRole('option', { name: /GitHub/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('combobox')).toHaveCount(0);
});

for (const width of [877, 1440]) {
  test(`hero controls respond without flicker at desktop width ${width}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Mouse interaction regression.');
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const hero = page.getByRole('main');
    // Finish the entry transition before measuring stationary hit areas.
    await expect.poll(() => page.locator('.hero-inner').evaluate(el => getComputedStyle(el).transform)).toBe('none');
    for (const name of ['Projects', 'Notes', 'About']) {
      const button = hero.getByRole('button', { name, exact: true });
      const before = (await button.boundingBox())!;
      const fill = await button.evaluate(el => getComputedStyle(el).backgroundImage);
      await button.hover();
      await expect.poll(() => button.evaluate(el => getComputedStyle(el, '::after').opacity)).toBe('0.09');
      expect(await button.evaluate(el => getComputedStyle(el).backgroundImage)).toBe(fill);
      // A cursor just inside the top edge must not retrigger enter/leave animation.
      await page.mouse.move(before.x + before.width / 2, before.y + .5);
      const frames = await button.evaluate(async el => {
        const samples = [];
        for (let i = 0; i < 24; i++) {
          await new Promise(requestAnimationFrame);
          const rect = el.getBoundingClientRect();
          samples.push({ hovered: el.matches(':hover'), x: rect.x, y: rect.y });
        }
        return samples;
      });
      expect(frames.every(frame => frame.hovered && Math.abs(frame.x - before.x) < .1 && Math.abs(frame.y - before.y) < .1)).toBe(true);
      await page.mouse.click(before.x + before.width / 2, before.y + .5);
      await expect(page.getByRole('dialog', { name, exact: true })).toBeVisible();
      await page.getByRole('button', { name: `Close ${name}`, exact: true }).click();
      await expect(page.getByRole('dialog', { name, exact: true })).toHaveCount(0);
    }
    const github = hero.getByRole('link', { name: 'GitHub', exact: true });
    await expect(github).toHaveAttribute('href', 'https://github.com/PaoPao1021');
    await expect(github).toHaveAttribute('target', '_blank');
    for (const name of ['GitHub', 'Email', 'Resume']) {
      const link = name === 'GitHub' ? github : hero.getByRole('button', { name, exact: true });
      await link.hover();
      await expect.poll(() => link.evaluate(el => getComputedStyle(el, '::after').transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
      if (name !== 'GitHub') {
        await link.click();
        await expect(hero.getByRole('status')).toContainText(name === 'Email' ? 'Email address isn’t available yet.' : 'Resume isn’t available yet.');
        await expect(page.getByRole('dialog')).toHaveCount(0);
      }
    }
  });
}

test('Home label remains centered with an inset keyboard focus ring in a narrow desktop', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop keyboard focus regression.');
  await page.setViewportSize({ width: 877, height: 1000 });
  await page.goto('/');
  const dock = page.getByRole('navigation', { name: 'Application dock' });
  const home = dock.getByRole('button', { name: 'Home', exact: true });
  await home.click();
  await page.mouse.move(5, 5);
  await expect(home).toBeFocused();
  expect(await home.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('none');
  // Return by keyboard to exercise focus-visible without hover hiding the bug.
  await page.keyboard.press('Tab');
  await expect(dock.getByRole('button', { name: 'Projects', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(home).toBeFocused();
  await expect.poll(() => home.locator('.dock-label').evaluate(el => getComputedStyle(el).translate)).toBe('none');
  const geometry = await home.evaluate(el => {
    const label = el.querySelector('.dock-label')!.getBoundingClientRect();
    const button = el.getBoundingClientRect();
    const css = getComputedStyle(el);
    return { labelCenter: label.x + label.width / 2, buttonCenter: button.x + button.width / 2, outline: css.outlineStyle, offset: parseFloat(css.outlineOffset) };
  });
  expect(geometry.labelCenter).toBeCloseTo(geometry.buttonCenter, 0);
  expect(geometry.outline).toBe('solid');
  expect(geometry.offset).toBeLessThan(0);
  await page.keyboard.press('Enter');
  await expect(home).toHaveAttribute('aria-current', 'page');
});
