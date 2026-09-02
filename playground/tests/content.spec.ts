import { expect, test, type Page } from '@playwright/test'

let pageErrors: Error[] = []

test.beforeEach(async ({ page }) => {
  pageErrors = []
  page.on('pageerror', (err) => pageErrors.push(err))
  await page.goto('/?section=content')
  await expect(page.getByTestId('content-section')).toBeVisible()
})

test.afterEach(() => {
  expect(pageErrors, pageErrors.map((e) => e.message).join('\n')).toEqual([])
})

async function classes(page: Page, testId: string) {
  return (await page.getByTestId(testId).getAttribute('class')) ?? ''
}

test('solid buttons render as native buttons with Preline token classes', async ({ page }) => {
  let buttons = page.getByTestId('button-colors').getByRole('button')
  await expect(buttons).toHaveCount(23)

  let blue = page.getByTestId('button-blue')
  await expect(blue).toHaveAttribute('type', 'button')
  let cls = await classes(page, 'button-blue')
  expect(cls).toContain('inline-flex')
  expect(cls).toContain('rounded-lg')
  expect(cls).toContain('bg-primary')
  expect(cls).toContain('text-primary-foreground')
  expect(cls).toContain('hover:bg-primary-hover')
  expect(cls).toContain('disabled:opacity-50')
  // TouchTarget helper span
  await expect(blue.locator('span[aria-hidden="true"]')).toHaveCount(1)

  expect(await classes(page, 'button-dark-zinc')).toContain('bg-secondary')
  expect(await classes(page, 'button-white')).toContain('bg-layer')
  expect(await classes(page, 'button-red')).toContain('bg-destructive')
  expect(await classes(page, 'button-teal')).toContain('bg-teal-500')
})

test('outline and plain buttons use their Preline variant classes', async ({ page }) => {
  let outline = await classes(page, 'button-outline')
  expect(outline).toContain('border-layer-line')
  expect(outline).not.toContain('bg-primary ')
  expect(outline).not.toContain('bg-secondary')

  let plain = await classes(page, 'button-plain')
  expect(plain).toContain('border-transparent')
  expect(plain).toContain('text-primary')
  expect(plain).not.toContain('bg-secondary')
})

test('Button href renders an anchor', async ({ page }) => {
  let link = page.getByTestId('button-href')
  await expect(link).toHaveJSProperty('tagName', 'A')
  await expect(link).toHaveAttribute('href', '/?section=content#link-target')
  expect(await classes(page, 'button-href')).not.toContain('cursor-pointer')
  await link.click()
  await expect(page).toHaveURL(/#link-target$/)
})

test('disabled button is disabled; submit type passes through; icon slot', async ({ page }) => {
  await expect(page.getByTestId('button-disabled')).toBeDisabled()
  await expect(page.getByTestId('button-submit')).toHaveAttribute('type', 'submit')
  await expect(page.getByTestId('button-icon').locator('svg[data-slot="icon"]')).toHaveCount(1)
  await expect(page.getByTestId('button-icon').locator('svg[data-slot="icon"]')).toHaveAttribute('aria-hidden', 'true')
})

test('badges render every color; BadgeButton renders button or anchor', async ({ page }) => {
  await expect(page.getByTestId('badges').locator('span')).toHaveCount(18)
  expect(await classes(page, 'badge-red')).toContain('bg-red-100')
  expect(await classes(page, 'badge-red')).toContain('rounded-full')
  expect(await classes(page, 'badge-zinc')).toContain('bg-surface')
  expect(await classes(page, 'badge-blue')).toContain('bg-primary-100')

  let btn = page.getByTestId('badge-button')
  await expect(btn).toHaveJSProperty('tagName', 'BUTTON')
  await expect(btn).toHaveAttribute('type', 'button')
  expect(await classes(page, 'badge-button')).toContain('group')
  await expect(btn.locator('span', { hasText: 'Badge button' })).toHaveClass(/bg-lime-100/)

  let link = page.getByTestId('badge-button-href')
  await expect(link).toHaveJSProperty('tagName', 'A')
  await expect(link).toHaveAttribute('href', '/?section=content')
})

test('avatars: image, initials fallback, square, alt handling', async ({ page }) => {
  let withSrc = page.getByTestId('avatar-src')
  await expect(withSrc).toHaveAttribute('data-slot', 'avatar')
  await expect(withSrc.locator('img')).toHaveAttribute('alt', 'Leslie Alexander')
  await expect(withSrc.locator('svg')).toHaveCount(0)
  expect(await classes(page, 'avatar-src')).toContain('rounded-full')

  let initials = page.getByTestId('avatar-initials')
  await expect(initials.locator('img')).toHaveCount(0)
  await expect(initials.locator('svg text')).toHaveText('LA')
  await expect(initials.locator('svg title')).toHaveText('Leslie Alexander')
  await expect(initials.locator('svg')).not.toHaveAttribute('aria-hidden', 'true')
  expect(await classes(page, 'avatar-initials')).toContain('bg-surface-4')

  let hidden = page.getByTestId('avatar-initials-hidden')
  await expect(hidden.locator('svg')).toHaveAttribute('aria-hidden', 'true')
  await expect(hidden.locator('svg title')).toHaveCount(0)

  expect(await classes(page, 'avatar-square')).toContain('rounded-lg')
  expect(await classes(page, 'avatar-square')).not.toContain('rounded-full')

  await expect(page.getByTestId('avatar-button')).toHaveJSProperty('tagName', 'BUTTON')
  await expect(page.getByTestId('avatar-button').locator('svg text')).toHaveText('AB')
  await expect(page.getByTestId('avatar-button-href')).toHaveJSProperty('tagName', 'A')
  await expect(page.getByTestId('avatar-button-href')).toHaveAttribute('href', '/?section=content')
})

test('headings and text primitives', async ({ page }) => {
  await expect(page.getByTestId('heading')).toHaveJSProperty('tagName', 'H1')
  await expect(page.getByTestId('heading-level-2')).toHaveJSProperty('tagName', 'H2')
  await expect(page.getByTestId('subheading')).toHaveJSProperty('tagName', 'H2')
  await expect(page.getByTestId('subheading-level-3')).toHaveJSProperty('tagName', 'H3')
  expect(await classes(page, 'heading')).toContain('text-2xl')
  expect(await classes(page, 'heading')).toContain('text-foreground')
  expect(await classes(page, 'subheading')).toContain('text-base')

  await expect(page.getByTestId('text')).toHaveAttribute('data-slot', 'text')
  expect(await classes(page, 'text')).toContain('text-muted-foreground-1')
  let link = page.getByTestId('text-link')
  await expect(link).toHaveJSProperty('tagName', 'A')
  await expect(link).toHaveAttribute('href', '/?section=content')
  expect(await classes(page, 'text-link')).toContain('underline')
  expect(await classes(page, 'text-link')).toContain('text-primary')
  await expect(page.getByTestId('strong')).toHaveJSProperty('tagName', 'STRONG')
  await expect(page.getByTestId('code')).toHaveJSProperty('tagName', 'CODE')
  expect(await classes(page, 'code')).toContain('bg-muted')
})

test('divider and description list', async ({ page }) => {
  await expect(page.getByTestId('divider')).toHaveAttribute('role', 'presentation')
  expect(await classes(page, 'divider')).toContain('border-border')
  expect(await classes(page, 'divider-soft')).toContain('border-line-1')

  let dl = page.getByTestId('description-list')
  await expect(dl).toHaveJSProperty('tagName', 'DL')
  await expect(dl.locator('dt')).toHaveCount(3)
  await expect(dl.locator('dd')).toHaveCount(3)
  await expect(dl.locator('dt').first()).toHaveClass(/text-muted-foreground-1/)
  await expect(dl.locator('dd').first()).toHaveClass(/text-foreground/)
})

test('table context flags and full-row link', async ({ page }) => {
  let table = page.getByTestId('table')
  expect(await classes(page, 'table')).toContain('overflow-x-auto')
  // bleed: no framed card around the table
  await expect(table.locator('> div')).not.toHaveClass(/border-table-line/)
  await expect(table.locator('table')).toHaveClass(/divide-table-line/)
  await expect(table.locator('thead')).toHaveClass(/text-muted-foreground-1/)
  let headerRow = table.locator('thead tr')
  await expect(headerRow).toHaveClass(/divide-x/) // grid
  let header = table.locator('th').first()
  await expect(header).toHaveClass(/uppercase/)
  await expect(header).toHaveClass(/py-2/) // dense

  let row = page.getByTestId('table-row-href')
  await expect(row).toHaveClass(/even:bg-surface/) // striped
  await expect(row).toHaveClass(/hover:bg-muted-hover/) // href
  await expect(row).toHaveClass(/divide-x/) // grid
  let cells = row.locator('td')
  await expect(cells).toHaveCount(3)
  await expect(cells.first()).toHaveClass(/py-2/) // dense
  await expect(cells.first()).toHaveClass(/relative/)

  let overlays = row.locator('a[data-row-link]')
  await expect(overlays).toHaveCount(3)
  await expect(overlays.first()).toHaveAttribute('href', '/?section=content#lesliealexander')
  await expect(overlays.first()).toHaveAttribute('aria-label', 'Leslie Alexander')
  await expect(overlays.first()).toHaveAttribute('tabindex', '0')
  await expect(overlays.nth(1)).toHaveAttribute('tabindex', '-1')
  await expect(overlays.nth(2)).toHaveAttribute('tabindex', '-1')

  let plainRow = page.getByTestId('table-row-1')
  await expect(plainRow.locator('a[data-row-link]')).toHaveCount(0)
  await expect(plainRow).not.toHaveClass(/hover:bg-muted-hover/)

  // Non-bleed table is framed in Preline's bordered card; cells use the regular padding
  let plain = page.getByTestId('table-plain')
  await expect(plain.locator('> div')).toHaveClass(/border-table-line/)
  await expect(plain.locator('> div')).toHaveClass(/rounded-lg/)
  let plainCell = plain.locator('td').first()
  await expect(plainCell).toHaveClass(/py-4/)
  await expect(plain.locator('thead tr')).not.toHaveClass(/divide-x/)
  await expect(plain.locator('tbody tr')).not.toHaveClass(/even:bg-surface/)

  await overlays.first().click()
  await expect(page).toHaveURL(/#lesliealexander$/)
})

test('stats', async ({ page }) => {
  let stats = page.getByTestId('stats')
  await expect(stats.locator('[data-testid^="stat-"]')).toHaveCount(2)
  expect(await classes(page, 'stat-up')).toContain('bg-card')
  expect(await classes(page, 'stat-up')).toContain('border-card-line')
  await expect(page.getByTestId('stat-up').locator('span').first()).toHaveClass(/bg-green-100/)
  await expect(page.getByTestId('stat-up').locator('span').first()).toHaveText('+4.5%')
  await expect(page.getByTestId('stat-down').locator('span').first()).toHaveClass(/bg-red-100/)
  await expect(page.getByTestId('stat-down')).toContainText('from last week')
})
