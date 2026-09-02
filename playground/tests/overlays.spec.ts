import { expect, test, type Page } from '@playwright/test'

/** Loads the overlays section and waits for the island to hydrate (first click must open the dialog). */
async function setup(page: Page) {
  let errors: string[] = []
  page.on('pageerror', (error) => errors.push(String(error)))
  await page.goto('/?section=overlays')
  await expect(async () => {
    await page.getByTestId('open-dialog').click()
    await expect(page.locator('dialog[data-testid=dialog][open]')).toBeVisible({ timeout: 500 })
  }).toPass({ timeout: 15_000 })
  await page.keyboard.press('Escape')
  await expect(page.locator('dialog[data-testid=dialog]')).not.toHaveAttribute('open')
  return errors
}

let bodyOverflow = (page: Page) => page.evaluate(() => document.body.style.overflow)

test.describe('Dialog', () => {
  test('opens via showModal, Escape closes, focus returns to the opener', async ({ page }) => {
    let errors = await setup(page)
    let trigger = page.getByTestId('open-dialog')
    let dialog = page.locator('dialog[data-testid=dialog]')

    await trigger.click()
    await expect(dialog).toHaveAttribute('open', '')
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(page.getByTestId('modal-state')).toHaveText(/dialog:true/)

    // aria wiring resolves to the rendered title/description
    let labelledBy = await dialog.getAttribute('aria-labelledby')
    let describedBy = await dialog.getAttribute('aria-describedby')
    expect(labelledBy).toBeTruthy()
    expect(describedBy).toBeTruthy()
    await expect(page.locator(`[id="${labelledBy}"]`)).toHaveText('Refund payment')
    await expect(page.locator(`[id="${describedBy}"]`)).toContainText('refund will be reflected')

    // Focus is inside the dialog (native showModal focus trap) and scroll is locked
    await expect.poll(() => page.evaluate(() => document.activeElement?.closest('dialog')?.dataset.testid)).toBe('dialog')
    await expect.poll(() => bodyOverflow(page)).toBe('hidden')

    await page.keyboard.press('Escape')
    await expect(dialog).not.toHaveAttribute('open')
    await expect(page.getByTestId('modal-state')).toHaveText(/dialog:false/)
    await expect(trigger).toBeFocused()
    await expect.poll(() => bodyOverflow(page)).toBe('')
    expect(errors).toEqual([])
  })

  test('backdrop click closes, clicks inside the panel do not', async ({ page }) => {
    let errors = await setup(page)
    let dialog = page.locator('dialog[data-testid=dialog]')
    await page.getByTestId('open-dialog').click()
    await expect(dialog).toHaveAttribute('open', '')

    await page.getByTestId('dialog-input').click()
    await expect(dialog).toHaveAttribute('open', '')
    await expect(page.getByTestId('dialog-input')).toBeFocused()

    // Top-left corner is backdrop
    await page.mouse.click(5, 5)
    await expect(dialog).not.toHaveAttribute('open')
    await expect(page.getByTestId('open-dialog')).toBeFocused()
    expect(errors).toEqual([])
  })

  test('action buttons close the dialog', async ({ page }) => {
    let errors = await setup(page)
    let dialog = page.locator('dialog[data-testid=dialog]')
    await page.getByTestId('open-dialog').click()
    await expect(dialog).toHaveAttribute('open', '')
    await page.getByTestId('dialog-confirm').click()
    await expect(dialog).not.toHaveAttribute('open')

    await page.getByTestId('open-dialog').click()
    await expect(dialog).toHaveAttribute('open', '')
    await page.getByTestId('dialog-cancel').click()
    await expect(dialog).not.toHaveAttribute('open')
    expect(errors).toEqual([])
  })
})

test.describe('Alert', () => {
  test('is an alertdialog; Escape, backdrop and actions close it', async ({ page }) => {
    let errors = await setup(page)
    let trigger = page.getByTestId('open-alert')
    let alert = page.locator('dialog[data-testid=alert]')

    await trigger.click()
    await expect(alert).toHaveAttribute('open', '')
    await expect(alert).toHaveAttribute('role', 'alertdialog')
    await expect(alert).toHaveAttribute('aria-labelledby', /.+/)
    await expect(alert).toHaveAttribute('aria-describedby', /.+/)

    await page.keyboard.press('Escape')
    await expect(alert).not.toHaveAttribute('open')
    await expect(trigger).toBeFocused()

    await trigger.click()
    await expect(alert).toHaveAttribute('open', '')
    await page.mouse.click(5, 5)
    await expect(alert).not.toHaveAttribute('open')

    await trigger.click()
    await expect(alert).toHaveAttribute('open', '')
    await page.getByTestId('alert-confirm').click()
    await expect(alert).not.toHaveAttribute('open')
    await expect(page.getByTestId('modal-state')).toHaveText(/alert:false/)
    expect(errors).toEqual([])
  })
})

test.describe('Dropdown', () => {
  test('click opens, arrow keys skip disabled items, Enter selects, Escape closes', async ({ page }) => {
    let errors = await setup(page)
    let trigger = page.getByTestId('dd-default')
    let menu = page.getByTestId('dd-default-menu')
    let list = menu.locator('[role=menu]')

    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(menu).toBeHidden()

    await trigger.click()
    await expect(menu).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(list).toBeFocused()
    await expect(menu).toHaveAttribute('data-anchor-placement', /^bottom/)

    await page.keyboard.press('ArrowDown')
    await expect(page.getByTestId('item-edit')).toHaveAttribute('data-highlighted', 'true')
    await expect(page.getByTestId('item-edit')).toBeFocused()

    // "archive" is disabled and skipped
    await page.keyboard.press('ArrowDown')
    await expect(page.getByTestId('item-duplicate')).toHaveAttribute('data-highlighted', 'true')
    await expect(page.getByTestId('item-archive')).not.toHaveAttribute('data-highlighted')
    await expect(page.getByTestId('item-archive')).toHaveAttribute('aria-disabled', 'true')

    await page.keyboard.press('ArrowUp')
    await expect(page.getByTestId('item-edit')).toHaveAttribute('data-highlighted', 'true')
    await page.keyboard.press('End')
    await expect(page.getByTestId('item-delete')).toHaveAttribute('data-highlighted', 'true')
    await page.keyboard.press('Home')
    await expect(page.getByTestId('item-edit')).toHaveAttribute('data-highlighted', 'true')

    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    // ArrowDown on the trigger opens with the first item highlighted
    await page.keyboard.press('ArrowDown')
    await expect(menu).toBeVisible()
    await expect(page.getByTestId('item-edit')).toHaveAttribute('data-highlighted', 'true')

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('selected')).toHaveText('duplicate')
    await expect(page.getByTestId('last-event')).toHaveText('duplicate:duplicate')
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()
    expect(errors).toEqual([])
  })

  test('href item is an anchor, typeahead, pointer select, disabled click is ignored', async ({ page }) => {
    let errors = await setup(page)
    let trigger = page.getByTestId('dd-default')
    let menu = page.getByTestId('dd-default-menu')

    await trigger.click()
    await expect(menu).toBeVisible()

    let link = page.getByTestId('item-link')
    expect(await link.evaluate((node) => node.tagName)).toBe('A')
    await expect(link).toHaveAttribute('href', '/?section=overlays#overlays')
    await expect(link).toHaveAttribute('role', 'menuitem')
    expect(await page.getByTestId('item-edit').evaluate((node) => node.tagName)).toBe('BUTTON')
    await expect(page.getByTestId('item-edit')).toHaveAttribute('type', 'button')

    // description / shortcut are announced through aria-describedby
    let describedBy = await page.getByTestId('item-duplicate').getAttribute('aria-describedby')
    expect(describedBy?.split(' ')).toHaveLength(2)

    await page.keyboard.type('del')
    await expect(page.getByTestId('item-delete')).toHaveAttribute('data-highlighted', 'true')

    await page.getByTestId('item-edit').hover()
    await expect(page.getByTestId('item-edit')).toHaveAttribute('data-highlighted', 'true')
    await page.getByTestId('item-edit').click()
    await expect(page.getByTestId('selected')).toHaveText('edit')
    await expect(menu).toBeHidden()

    await trigger.click()
    await expect(menu).toBeVisible()
    await page.getByTestId('item-archive').click({ force: true })
    await expect(page.getByTestId('selected')).toHaveText('edit')
    await expect(menu).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    expect(errors).toEqual([])
  })

  test('plain trigger, sections/headings/dividers, outside click, anchor placements', async ({ page }) => {
    let errors = await setup(page)
    let trigger = page.getByTestId('dd-plain')
    let menu = page.getByTestId('dd-plain-menu')

    expect(await trigger.evaluate((node) => node.tagName)).toBe('BUTTON')
    await expect(trigger).toHaveAttribute('type', 'button')
    await trigger.click()
    await expect(menu).toBeVisible()
    // A tall menu may flip above the trigger; the `end` alignment must be preserved
    await expect(menu).toHaveAttribute('data-anchor-placement', /^(top|bottom)-end$/)
    await expect(menu.locator('[role=menu]')).toHaveAttribute('aria-label', 'Account')

    let section = page.getByTestId('dd-section-account')
    await expect(section).toHaveAttribute('role', 'group')
    let labelledBy = await section.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    await expect(page.locator(`[id="${labelledBy}"]`)).toHaveText('Account')
    expect(await menu.locator('[role=separator]').count()).toBe(3)

    await page.mouse.click(5, 5)
    await expect(menu).toBeHidden()

    for (let anchor of ['top-start', 'top-end', 'bottom-start', 'bottom-end']) {
      let t = page.getByTestId(`dd-anchor-${anchor}`)
      let m = page.getByTestId(`dd-anchor-${anchor}-menu`)
      await t.click()
      await expect(m).toBeVisible()
      await expect(m).toHaveAttribute('data-anchor-placement', anchor)
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      await expect(page.getByTestId('selected')).toHaveText(`${anchor.replace('-', ' ')}-1`)
      await expect(m).toBeHidden()
    }
    expect(errors).toEqual([])
  })
})
