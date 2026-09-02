import { expect, test, type Page } from '@playwright/test'

async function gotoSection(page: Page) {
  let errors: Error[] = []
  page.on('pageerror', (error) => errors.push(error))
  await page.goto('/?section=selection')
  await expect(page.getByTestId('selection-form')).toHaveAttribute('data-hydrated', '')
  return errors
}

function listbox(page: Page) {
  let trigger = page.getByTestId('listbox')
  let list = page.locator('[role="listbox"]', { has: page.getByTestId('listbox-option-alice') })
  let hidden = page.locator('input[type="hidden"][name="assignee"]')
  return { trigger, list, hidden }
}

function combobox(page: Page) {
  let input = page.getByTestId('combobox')
  let hidden = page.locator('input[type="hidden"][name="person"]')
  return { input, hidden }
}

test.describe('Listbox', () => {
  test('renders preselected, placeholder, disabled and invalid variants without page errors', async ({ page }) => {
    let errors = await gotoSection(page)
    let { trigger, hidden } = listbox(page)

    await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toContainText('Wade')
    await expect(trigger).toContainText('Support')
    await expect(hidden).toHaveValue('wade')
    await expect(page.getByTestId('listbox-value')).toHaveText('wade')

    await expect(page.getByTestId('listbox-placeholder')).toContainText('Choose a priority')
    await expect(page.locator('input[type="hidden"][name="priority"]')).toHaveValue('')

    await expect(page.getByTestId('listbox-disabled')).toBeDisabled()
    await expect(page.getByTestId('listbox-invalid')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByTestId('listbox-invalid')).toHaveAttribute('data-invalid', '')
    await expect(page.getByTestId('listbox-invalid')).toContainText('Pick one')
    expect(errors).toEqual([])
  })

  test('opens on click, arrows move the highlight, Enter selects', async ({ page }) => {
    let errors = await gotoSection(page)
    let { trigger, list, hidden } = listbox(page)

    await trigger.click()
    await expect(list).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(list).toBeFocused()
    // Reopening highlights the current selection, which also shows the check icon.
    await expect(page.getByTestId('listbox-option-wade')).toHaveAttribute('data-highlighted', 'true')
    await expect(page.getByTestId('listbox-option-wade')).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByTestId('listbox-option-wade').locator('svg')).toBeVisible()
    await expect(page.getByTestId('listbox-option-alice').locator('svg')).toBeHidden()

    await page.keyboard.press('Home')
    await expect(page.getByTestId('listbox-option-alice')).toHaveAttribute('data-highlighted', 'true')
    await page.keyboard.press('ArrowDown')
    // Bob is disabled and skipped.
    await expect(page.getByTestId('listbox-option-carol')).toHaveAttribute('data-highlighted', 'true')
    await expect(page.getByTestId('listbox-option-bob')).toHaveAttribute('aria-disabled', 'true')
    await page.keyboard.press('ArrowUp')
    await expect(page.getByTestId('listbox-option-alice')).toHaveAttribute('data-highlighted', 'true')
    await page.keyboard.press('End')
    await expect(page.getByTestId('listbox-option-wade')).toHaveAttribute('data-highlighted', 'true')
    await page.keyboard.press('ArrowUp')
    await expect(page.getByTestId('listbox-option-dave')).toHaveAttribute('data-highlighted', 'true')

    await page.keyboard.press('Enter')
    await expect(list).toBeHidden()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toContainText('Dave')
    await expect(trigger).toContainText('Marketing')
    await expect(trigger).not.toContainText('Wade')
    await expect(hidden).toHaveValue('dave')
    await expect(page.getByTestId('listbox-value')).toHaveText('dave')
    await expect(trigger).toBeFocused()
    expect(errors).toEqual([])
  })

  test('opens with ArrowDown, typeahead jumps, Space selects, Escape closes', async ({ page }) => {
    let errors = await gotoSection(page)
    let { trigger, list, hidden } = listbox(page)

    await trigger.focus()
    await page.keyboard.press('ArrowDown')
    await expect(list).toBeVisible()
    await expect(list).toBeFocused()

    await page.keyboard.type('c')
    await expect(page.getByTestId('listbox-option-carol')).toHaveAttribute('data-highlighted', 'true')

    await page.keyboard.press('Escape')
    await expect(list).toBeHidden()
    await expect(trigger).toBeFocused()
    // Escape does not change the selection.
    await expect(trigger).toContainText('Wade')
    await expect(hidden).toHaveValue('wade')

    await page.keyboard.press('ArrowUp')
    await expect(list).toBeVisible()
    await expect(list).toBeFocused()
    await page.keyboard.type('a')
    await expect(page.getByTestId('listbox-option-alice')).toHaveAttribute('data-highlighted', 'true')
    await page.keyboard.press(' ')
    await expect(list).toBeHidden()
    await expect(trigger).toContainText('Alice')
    await expect(hidden).toHaveValue('alice')
    expect(errors).toEqual([])
  })

  test('selects with the mouse and closes on outside click', async ({ page }) => {
    let errors = await gotoSection(page)
    let { trigger, list, hidden } = listbox(page)

    await trigger.click()
    await expect(list).toBeVisible()
    await page.getByTestId('listbox-option-carol').click()
    await expect(list).toBeHidden()
    await expect(trigger).toContainText('Carol')
    await expect(hidden).toHaveValue('carol')

    await trigger.click()
    await expect(list).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(list).toBeHidden()
    await expect(hidden).toHaveValue('carol')
    expect(errors).toEqual([])
  })

  test('closed-trigger typeahead selects immediately', async ({ page }) => {
    let errors = await gotoSection(page)
    let { trigger, list, hidden } = listbox(page)

    await trigger.focus()
    await page.keyboard.type('d')
    await expect(list).toBeHidden()
    await expect(trigger).toContainText('Dave')
    await expect(hidden).toHaveValue('dave')
    await expect(page.getByTestId('listbox-value')).toHaveText('dave')
    expect(errors).toEqual([])
  })

  test('placeholder listbox shows the selection after picking', async ({ page }) => {
    let errors = await gotoSection(page)
    let trigger = page.getByTestId('listbox-placeholder')
    let hidden = page.locator('input[type="hidden"][name="priority"]')

    await trigger.click()
    await page.getByRole('option', { name: 'High' }).click()
    await expect(trigger).toContainText('High')
    await expect(trigger).not.toContainText('Choose a priority')
    await expect(hidden).toHaveValue('high')
    expect(errors).toEqual([])
  })

  test('disabled listbox does not open', async ({ page }) => {
    let errors = await gotoSection(page)
    let trigger = page.getByTestId('listbox-disabled')
    await expect(trigger).toBeDisabled()
    await trigger.click({ force: true })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('input[type="hidden"][name="disabled_listbox"]')).toBeDisabled()
    expect(errors).toEqual([])
  })
})

test.describe('Combobox', () => {
  test('filters while typing, ArrowDown + Enter selects, hidden input updates', async ({ page }) => {
    let errors = await gotoSection(page)
    let { input, hidden } = combobox(page)

    await expect(input).toHaveAttribute('role', 'combobox')
    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await expect(input).toHaveAttribute('aria-autocomplete', 'list')
    await expect(hidden).toHaveValue('')

    await input.click()
    await input.fill('')
    await page.keyboard.type('son')
    await expect(input).toHaveAttribute('aria-expanded', 'true')
    let list = page.locator(`#${await input.getAttribute('aria-controls')}`)
    await expect(list).toBeVisible()
    await expect(list.locator('[role="option"]:not([hidden])')).toHaveCount(1)
    await expect(page.getByTestId('combobox-option-1')).toBeVisible()
    await expect(page.getByTestId('combobox-option-1')).toContainText('Alice Johnson')
    await expect(page.getByTestId('combobox-option-1')).toContainText('Engineering')

    await page.keyboard.press('ArrowDown')
    await expect(page.getByTestId('combobox-option-1')).toHaveAttribute('data-highlighted', 'true')
    await expect(input).toHaveAttribute('aria-activedescendant', (await page.getByTestId('combobox-option-1').getAttribute('id'))!)
    await page.keyboard.press('Enter')
    await expect(list).toBeHidden()
    await expect(input).toHaveValue('Alice Johnson')
    await expect(hidden).toHaveValue('1')
    await expect(page.getByTestId('combobox-value')).toHaveText('1:Alice Johnson')
    await expect(input).toBeFocused()

    // Reopening after a filtered selection shows every option again (query resets on close).
    await page.keyboard.press('ArrowDown')
    await expect(list).toBeVisible()
    await expect(list.locator('[role="option"]:not([hidden])')).toHaveCount(5)
    await expect(page.getByTestId('combobox-option-1')).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByTestId('combobox-option-1')).toHaveAttribute('data-highlighted', 'true')
    await expect(page.getByTestId('combobox-option-1').locator('svg')).toBeVisible()
    await expect(page.getByTestId('combobox-option-2').locator('svg')).toBeHidden()
    await page.keyboard.press('Escape')
    await expect(list).toBeHidden()
    await expect(input).toHaveValue('Alice Johnson')
    await expect(hidden).toHaveValue('1')
    expect(errors).toEqual([])
  })

  test('case-insensitive substring filter, no matches closes the list, Escape clears', async ({ page }) => {
    let errors = await gotoSection(page)
    let { input } = combobox(page)

    await input.click()
    await page.keyboard.type('KOW')
    let list = page.locator(`#${await input.getAttribute('aria-controls')}`)
    await expect(list).toBeVisible()
    await expect(list.locator('[role="option"]:not([hidden])')).toHaveCount(1)
    await expect(page.getByTestId('combobox-option-5')).toBeVisible()

    await page.keyboard.type('zz')
    await expect(list).toBeHidden()
    await expect(input).toHaveValue('KOWzz')

    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await expect(list).toBeVisible()
    await expect(page.getByTestId('combobox-option-5')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(list).toBeHidden()
    await expect(input).toHaveValue('')
    expect(errors).toEqual([])
  })

  test('chevron button toggles the list and mouse selection commits', async ({ page }) => {
    let errors = await gotoSection(page)
    let { input, hidden } = combobox(page)
    let button = page.locator('[data-testid="combobox"] ~ button')

    await button.click()
    let list = page.locator(`#${await input.getAttribute('aria-controls')}`)
    await expect(list).toBeVisible()
    await expect(input).toBeFocused()
    await expect(list.locator('[role="option"]:not([hidden])')).toHaveCount(5)

    await page.getByTestId('combobox-option-3').click()
    await expect(list).toBeHidden()
    await expect(input).toHaveValue('Carol Nguyen')
    await expect(hidden).toHaveValue('3')

    await button.click()
    await expect(list).toBeVisible()
    await expect(page.getByTestId('combobox-option-3')).toHaveAttribute('aria-selected', 'true')
    await button.click()
    await expect(list).toBeHidden()
    await expect(hidden).toHaveValue('3')
    expect(errors).toEqual([])
  })

  test('preselected value shows its display value and survives blur', async ({ page }) => {
    let errors = await gotoSection(page)
    let input = page.getByTestId('combobox-preselected')
    let hidden = page.locator('input[type="hidden"][name="person_preselected"]')

    await expect(input).toHaveValue('Carol Nguyen')
    await expect(hidden).toHaveValue('3')
    await input.focus()
    await page.keyboard.press('Tab')
    await expect(input).toHaveValue('Carol Nguyen')
    await expect(hidden).toHaveValue('3')
    expect(errors).toEqual([])
  })

  test('invalid and disabled comboboxes', async ({ page }) => {
    let errors = await gotoSection(page)
    let invalid = page.getByTestId('combobox-invalid')
    let disabled = page.getByTestId('combobox-disabled')

    await expect(invalid).toHaveAttribute('aria-invalid', 'true')
    await expect(invalid).toHaveAttribute('data-invalid', '')
    await expect(disabled).toBeDisabled()
    await expect(page.locator('[data-testid="combobox-disabled"] ~ button')).toBeDisabled()
    await expect(page.locator('input[type="hidden"][name="person_disabled"]')).toBeDisabled()
    expect(errors).toEqual([])
  })
})

test('form submit posts listbox and combobox values to /echo', async ({ page }) => {
  let errors = await gotoSection(page)
  let { trigger } = listbox(page)
  let { input } = combobox(page)

  await trigger.click()
  await page.getByTestId('listbox-option-carol').click()
  await expect(page.locator('input[type="hidden"][name="assignee"]')).toHaveValue('carol')
  // Let the listbox popover finish closing (it restores focus to the trigger once hidden).
  await expect(trigger).toBeFocused()
  await expect(trigger).toContainText('Carol')

  await input.click()
  await page.keyboard.type('bob')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page.locator('input[type="hidden"][name="person"]')).toHaveValue('2')
  // Let the combobox popover finish closing (an open popover swallows outside clicks).
  await expect(input).toHaveValue('Bob Martinez')
  await expect(input).toHaveAttribute('aria-expanded', 'false')

  await page.getByTestId('submit').click()
  await page.waitForURL('**/echo')
  let body = JSON.parse(await page.locator('body').innerText())
  expect(body).toMatchObject({
    assignee: 'carol',
    person: '2',
    person_preselected: '3',
    invalid_listbox: '',
    priority: '',
    person_invalid: '',
  })
  expect(body).not.toHaveProperty('disabled_listbox')
  expect(body).not.toHaveProperty('person_disabled')
  expect(errors).toEqual([])
})
