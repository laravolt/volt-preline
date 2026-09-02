import { expect, test, type Page } from '@playwright/test'

async function gotoForms(page: Page) {
  let errors: Error[] = []
  page.on('pageerror', (error) => errors.push(error))
  await page.goto('/?section=forms')
  await expect(page.getByTestId('forms-form')).toBeVisible()
  // Wait for hydration: the checkbox `indeterminate` DOM property is only set client-side.
  await expect
    .poll(() => page.getByTestId('checkbox-indeterminate').evaluate((el) => (el as HTMLInputElement).indeterminate))
    .toBe(true)
  return errors
}

test('renders without page errors', async ({ page }) => {
  let errors = await gotoForms(page)
  expect(errors).toEqual([])
})

test('field context wires label, description, error and disabled state', async ({ page }) => {
  await gotoForms(page)

  let input = page.getByTestId('input-text')
  let label = page.getByTestId('label-name')
  let description = page.getByTestId('description-name')
  let id = await input.getAttribute('id')
  expect(id).toBeTruthy()
  await expect(label).toHaveAttribute('for', id!)
  await expect(description).toHaveAttribute('id', `${id}-description`)
  await expect(input).toHaveAttribute('aria-describedby', `${id}-description ${id}-error`)

  await label.click()
  await expect(input).toBeFocused()

  let invalid = page.getByTestId('input-invalid')
  await expect(invalid).toHaveAttribute('aria-invalid', 'true')
  let invalidId = await invalid.getAttribute('id')
  await expect(page.getByTestId('error-username')).toHaveAttribute('id', `${invalidId}-error`)
  await expect(page.getByTestId('textarea-invalid')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByTestId('select-invalid')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByTestId('input-text')).not.toHaveAttribute('aria-invalid')

  await expect(page.getByTestId('input-disabled')).toBeDisabled()
  await expect(page.getByTestId('label-disabled')).toHaveAttribute('data-disabled', '')
  await expect(page.getByTestId('description-disabled')).toHaveAttribute('data-disabled', '')
})

test('input group pads the input for leading and trailing icons', async ({ page }) => {
  await gotoForms(page)
  let email = page.getByTestId('input-email')
  let url = page.getByTestId('input-url')
  let plain = page.getByTestId('input-password')
  let plainPad = await plain.evaluate((el) => parseFloat(getComputedStyle(el).paddingInlineStart))
  expect(await email.evaluate((el) => parseFloat(getComputedStyle(el).paddingInlineStart))).toBeGreaterThan(plainPad)
  expect(await url.evaluate((el) => parseFloat(getComputedStyle(el).paddingInlineEnd))).toBeGreaterThan(plainPad)
  // Icon does not intercept clicks: clicking where the leading icon sits still focuses the input.
  await page.getByTestId('input-group').getByTestId('input-icon').click({ force: true })
  await expect(email).toBeFocused()
})

test('checkbox toggles via label, click and Space, and fires onChange', async ({ page }) => {
  await gotoForms(page)
  let box = page.getByTestId('checkbox-blue')
  await expect(box).toHaveAttribute('type', 'checkbox')
  await expect(box).not.toBeChecked()

  await page.getByTestId('checkbox-blue-label').click()
  await expect(box).toBeChecked()
  await expect(page.getByTestId('last-change')).toHaveText('sms:true')

  await box.click()
  await expect(box).not.toBeChecked()
  await expect(page.getByTestId('last-change')).toHaveText('sms:false')

  await box.focus()
  await page.keyboard.press('Space')
  await expect(box).toBeChecked()

  await expect(page.getByTestId('checkbox-default')).toBeChecked()
  let disabled = page.getByTestId('checkbox-disabled')
  await expect(disabled).toBeDisabled()
  await expect(disabled).toBeChecked()
  // Playwright retargets label clicks to the control and waits for it to be enabled, so force the click.
  await page.getByTestId('checkbox-disabled-label').click({ force: true })
  await expect(disabled).toBeChecked()
})

test('checkbox indeterminate state is set on the input', async ({ page }) => {
  await gotoForms(page)
  let box = page.getByTestId('checkbox-indeterminate')
  expect(await box.evaluate((el) => (el as HTMLInputElement).indeterminate)).toBe(true)
  expect(await box.evaluate((el) => el.matches(':indeterminate'))).toBe(true)
  await expect(box).not.toBeChecked()
  // Clicking clears indeterminate natively and checks the box.
  await box.click()
  await expect(box).toBeChecked()
  expect(await box.evaluate((el) => (el as HTMLInputElement).indeterminate)).toBe(false)
})

test('radio group selects one value via click and keyboard', async ({ page }) => {
  await gotoForms(page)
  let free = page.getByTestId('radio-free')
  let pro = page.getByTestId('radio-pro')
  let enterprise = page.getByTestId('radio-enterprise')

  await expect(page.getByTestId('radio-group')).toHaveAttribute('role', 'radiogroup')
  for (let radio of [free, pro, enterprise]) {
    await expect(radio).toHaveAttribute('type', 'radio')
    await expect(radio).toHaveAttribute('name', 'plan')
  }
  await expect(pro).toBeChecked()

  await page.getByTestId('radio-free-label').click()
  await expect(free).toBeChecked()
  await expect(pro).not.toBeChecked()
  await expect(page.getByTestId('last-change')).toHaveText('plan:free')

  await page.keyboard.press('ArrowDown')
  await expect(pro).toBeChecked()
  await expect(page.getByTestId('last-change')).toHaveText('plan:pro')

  await page.keyboard.press('ArrowRight')
  await expect(enterprise).toBeChecked()
  await expect(page.getByTestId('last-change')).toHaveText('plan:enterprise')

  // The disabled radio is skipped; arrows wrap back to the first enabled one.
  await page.keyboard.press('ArrowDown')
  await expect(free).toBeChecked()

  await enterprise.focus()
  await page.keyboard.press('Space')
  await expect(enterprise).toBeChecked()

  await expect(page.getByTestId('radio-disabled')).toBeDisabled()
})

test('switch is a native checkbox with role=switch and toggles via click and Space', async ({ page }) => {
  await gotoForms(page)
  let sw = page.getByTestId('switch-green')
  await expect(sw).toHaveAttribute('type', 'checkbox')
  await expect(sw).toHaveAttribute('role', 'switch')
  await expect(sw).not.toBeChecked()

  await sw.click()
  await expect(sw).toBeChecked()
  await expect(page.getByTestId('last-change')).toHaveText('twofa:true')

  await sw.focus()
  await page.keyboard.press('Space')
  await expect(sw).not.toBeChecked()
  await expect(page.getByTestId('last-change')).toHaveText('twofa:false')

  await page.getByTestId('switch-default-label').click()
  await expect(page.getByTestId('switch-default')).not.toBeChecked()

  await expect(page.getByTestId('switch-disabled')).toBeDisabled()

  // Knob moves when checked (Preline peer-checked:translate-x-full).
  let knobX = (el: HTMLElement) => el.parentElement!.lastElementChild!.getBoundingClientRect().left
  let unchecked = await sw.evaluate(knobX)
  await sw.check()
  await expect.poll(() => sw.evaluate(knobX)).toBeGreaterThan(unchecked)
})

test('select renders chevron for single and none for multiple', async ({ page }) => {
  await gotoForms(page)
  let single = page.getByTestId('select-single')
  let multiple = page.getByTestId('select-multiple')
  await expect(single).toHaveValue('id')
  await expect(multiple).toHaveAttribute('multiple', '')
  await expect(multiple).toHaveValues(['en', 'id'])
  expect(await single.evaluate((el) => el.parentElement!.querySelector('svg') !== null)).toBe(true)
  expect(await multiple.evaluate((el) => el.parentElement!.querySelector('svg') !== null)).toBe(false)
  await single.selectOption('jp')
  await expect(single).toHaveValue('jp')
  await multiple.selectOption(['ja'])
  await expect(multiple).toHaveValues(['ja'])
})

test('submitting posts native values to /echo', async ({ page }) => {
  await gotoForms(page)
  await page.getByTestId('input-email').fill('ada@example.com')
  await page.getByTestId('checkbox-green').check()
  await page.getByTestId('switch-sky').check()

  let responsePromise = page.waitForResponse((res) => res.url().endsWith('/echo') && res.request().method() === 'POST')
  await page.getByTestId('submit').click()
  let response = await responsePromise
  expect(response.ok()).toBe(true)
  let json = await response.json()

  expect(json).toMatchObject({
    name: 'Ada',
    email: 'ada@example.com',
    birthday: '2000-01-02',
    username: 'ada!',
    bio: 'Hello',
    country: 'id',
    region: '',
    plan: 'pro',
    public: 'yes',
    marketing: 'yes',
    white: 'yes',
  })
  // Disabled controls are not submitted.
  expect(json).not.toHaveProperty('employee_id')
  expect(json).not.toHaveProperty('beta')
  expect(json).not.toHaveProperty('twofa')
  // Object.fromEntries keeps the last value for repeated names; checked boxes are email, push (locked is disabled).
  expect(json.notify).toBe('push')
  expect(json.languages).toBe('id')
})
