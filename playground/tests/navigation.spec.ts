import { expect, test, type Page } from '@playwright/test'

const INDICATOR = '[data-slot="current-indicator"]'

async function gotoSection(page: Page) {
  let errors: Error[] = []
  page.on('pageerror', (error) => errors.push(error))
  await page.goto('/?section=navigation')
  await page.waitForLoadState('networkidle')
  return errors
}

test('renders without page errors and hydrates', async ({ page }) => {
  let errors = await gotoSection(page)
  await expect(page.getByTestId('navbar')).toBeVisible()
  await expect(page.getByTestId('pagination')).toBeVisible()
  await expect(page.getByTestId('auth-layout')).toBeVisible()
  await expect(page.getByTestId('auth-form').getByRole('button', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByTestId('link-internal')).toHaveAttribute('href', '/?section=navigation')
  await expect(page.getByTestId('link-external')).toHaveAttribute('target', '_blank')
  expect(errors).toEqual([])
})

test.describe('mobile drawers', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  for (let layout of ['sidebar-layout', 'stacked-layout'] as const) {
    test(`${layout}: Open navigation opens the dialog, Close navigation closes it`, async ({ page }) => {
      let errors = await gotoSection(page)
      let root = page.getByTestId(layout)
      let dialog = root.locator('dialog')
      await expect(dialog).toHaveAttribute('aria-label', 'Navigation')
      await expect(dialog).not.toHaveAttribute('open')

      await root.getByRole('button', { name: 'Open navigation' }).click()
      await expect(root.locator('dialog[open]')).toHaveCount(1)
      await expect(dialog).toBeVisible()
      await expect(dialog.getByRole('link', { name: 'Events' })).toBeVisible()

      await dialog.getByRole('button', { name: 'Close navigation' }).click()
      await expect(root.locator('dialog[open]')).toHaveCount(0)
      expect(errors).toEqual([])
    })

    test(`${layout}: Escape closes the drawer`, async ({ page }) => {
      await gotoSection(page)
      let root = page.getByTestId(layout)
      await root.getByRole('button', { name: 'Open navigation' }).click()
      await expect(root.locator('dialog[open]')).toHaveCount(1)
      await page.keyboard.press('Escape')
      await expect(root.locator('dialog[open]')).toHaveCount(0)
    })

    test(`${layout}: clicking a sidebar link inside the drawer closes it`, async ({ page }) => {
      await gotoSection(page)
      let root = page.getByTestId(layout)
      await root.getByRole('button', { name: 'Open navigation' }).click()
      let dialog = root.locator('dialog[open]')
      await expect(dialog).toHaveCount(1)
      await dialog.getByRole('link', { name: 'Orders' }).click()
      await expect(root.locator('dialog[open]')).toHaveCount(0)
    })
  }

  test('sidebar-layout: the desktop sidebar is hidden on mobile', async ({ page }) => {
    await gotoSection(page)
    let root = page.getByTestId('sidebar-layout')
    await expect(root.locator('> div:first-child [data-testid="sidebar"]')).toBeHidden()
    await expect(root.getByRole('button', { name: 'Open navigation' })).toBeVisible()
  })
})

test('pagination marks the current page', async ({ page }) => {
  await gotoSection(page)
  let nav = page.getByTestId('pagination')
  await expect(nav).toHaveAttribute('aria-label', 'Page navigation')
  let current = nav.locator('[aria-current="page"]')
  await expect(current).toHaveCount(1)
  await expect(current).toHaveText('3')
  await expect(current).toHaveAttribute('aria-label', 'Page 3')
  await expect(nav.getByRole('link', { name: 'Previous page' })).toHaveAttribute('href', '?page=2')
  await expect(nav.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '?page=4')

  // First page: previous is a disabled button (href null)
  let first = page.getByTestId('pagination-first')
  await expect(first).toHaveAttribute('aria-label', 'First page pagination')
  await expect(first.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  await expect(first.locator('[aria-current="page"]')).toHaveText('1')
})

test('clicking a navbar item moves data-current and the single indicator span', async ({ page }) => {
  let errors = await gotoSection(page)
  let tabs = page.getByTestId('navbar-tabs')
  // data-testid is spread onto the <button>; the indicator span is its sibling inside the wrapper.
  let home = page.getByTestId('navbar-tab-home')
  let events = page.getByTestId('navbar-tab-events')
  await expect(tabs.locator('[data-current="true"]')).toHaveCount(1)
  await expect(home).toHaveAttribute('data-current', 'true')
  await expect(home.locator('..').locator(INDICATOR)).toHaveCount(1)
  await expect(tabs.locator(INDICATOR)).toHaveCount(1)

  await events.click()
  await expect(page.getByTestId('navbar-active')).toHaveText('Active: events')
  await expect(events).toHaveAttribute('data-current', 'true')
  await expect(home).not.toHaveAttribute('data-current', 'true')
  await expect(tabs.locator('[data-current="true"]')).toHaveCount(1)
  await expect(events.locator('..').locator(INDICATOR)).toHaveCount(1)
  await expect(home.locator('..').locator(INDICATOR)).toHaveCount(0)
  await expect(tabs.locator(INDICATOR)).toHaveCount(1)

  await page.getByTestId('navbar-tab-orders').click()
  await expect(page.getByTestId('navbar-tab-orders')).toHaveAttribute('data-current', 'true')
  await expect(tabs.locator(INDICATOR)).toHaveCount(1)
  expect(errors).toEqual([])
})

test('sidebar current item has data-current and one indicator span', async ({ page }) => {
  await gotoSection(page)
  // Desktop sidebar (outside the dialog)
  let sidebar = page.getByTestId('sidebar-layout').locator('> div:first-child [data-testid="sidebar"]')
  let current = sidebar.locator('a[data-current="true"]')
  await expect(current).toHaveCount(1)
  await expect(current).toHaveText('Events')
  await expect(current.locator('..').locator(INDICATOR)).toHaveCount(1)
  await expect(sidebar.locator(INDICATOR)).toHaveCount(1)
})
