import { clientEntry, type Handle } from 'remix/ui'

import { Checkbox, CheckboxField, CheckboxGroup } from '../../src/checkbox.tsx'
import { Description, ErrorMessage, Field, FieldGroup, Fieldset, Label, Legend } from '../../src/fieldset.tsx'
import { Input, InputGroup } from '../../src/input.tsx'
import { Radio, RadioField, RadioGroup } from '../../src/radio.tsx'
import { Select } from '../../src/select.tsx'
import { Switch, SwitchField, SwitchGroup } from '../../src/switch.tsx'
import { Textarea } from '../../src/textarea.tsx'

function MailIcon(_handle: Handle) {
  return () => (
    <svg
      data-slot="icon"
      data-testid="input-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

export const Section = clientEntry(import.meta.url, function Section(handle: Handle) {
  let lastChange = ''
  let plan = 'pro'

  return () => (
    <form method="post" action="/echo" data-testid="forms-form" className="max-w-xl">
      <Fieldset>
        <Legend data-testid="legend">Account</Legend>
        <FieldGroup>
          <Field>
            <Label data-testid="label-name">Name</Label>
            <Input name="name" defaultValue="Ada" data-testid="input-text" />
            <Description data-testid="description-name">Your full name.</Description>
          </Field>

          <Field>
            <Label>Email</Label>
            <InputGroup data-testid="input-group">
              <MailIcon />
              <Input type="email" name="email" placeholder="you@example.com" data-testid="input-email" />
            </InputGroup>
          </Field>

          <Field>
            <Label>Website</Label>
            <InputGroup data-testid="input-group-trailing">
              <Input type="url" name="website" placeholder="https://" data-testid="input-url" />
              <MailIcon />
            </InputGroup>
          </Field>

          <Field>
            <Label>Password</Label>
            <Input type="password" name="password" data-testid="input-password" />
          </Field>

          <Field>
            <Label>Birthday</Label>
            <Input type="date" name="birthday" defaultValue="2000-01-02" data-testid="input-date" />
          </Field>

          <Field>
            <Label>Username</Label>
            <Input name="username" invalid defaultValue="ada!" data-testid="input-invalid" />
            <ErrorMessage data-testid="error-username">Only letters and numbers are allowed.</ErrorMessage>
          </Field>

          <Field disabled>
            <Label data-testid="label-disabled">Employee ID</Label>
            <Input name="employee_id" defaultValue="E-42" data-testid="input-disabled" />
            <Description data-testid="description-disabled">Managed by your administrator.</Description>
          </Field>

          <Field>
            <Label>Bio</Label>
            <Textarea name="bio" defaultValue="Hello" data-testid="textarea" />
          </Field>

          <Field>
            <Label>Notes (invalid, fixed height)</Label>
            <Textarea name="notes" invalid resizable={false} rows={2} data-testid="textarea-invalid" />
            <ErrorMessage>Too short.</ErrorMessage>
          </Field>

          <Field>
            <Label>Country</Label>
            <Select name="country" defaultValue="id" data-testid="select-single">
              <option value="us">United States</option>
              <option value="id">Indonesia</option>
              <option value="jp">Japan</option>
            </Select>
          </Field>

          <Field>
            <Label>Languages</Label>
            <Select name="languages" multiple data-testid="select-multiple">
              <option value="en" selected>
                English
              </option>
              <option value="id" selected>
                Indonesian
              </option>
              <option value="ja">Japanese</option>
            </Select>
          </Field>

          <Field>
            <Label>Region (invalid)</Label>
            <Select name="region" invalid data-testid="select-invalid">
              <option value="">Choose…</option>
              <option value="apac">APAC</option>
            </Select>
            <ErrorMessage>Pick a region.</ErrorMessage>
          </Field>

          <CheckboxGroup data-testid="checkbox-group">
            <CheckboxField>
              <Checkbox name="notify" value="email" defaultChecked data-testid="checkbox-default" />
              <Label data-testid="checkbox-default-label">Email notifications</Label>
              <Description>Weekly summary of activity.</Description>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                name="notify"
                value="sms"
                color="blue"
                data-testid="checkbox-blue"
                onChange={(checked) => {
                  lastChange = `sms:${checked}`
                  handle.update()
                }}
              />
              <Label data-testid="checkbox-blue-label">SMS notifications</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox name="notify" value="push" color="green" data-testid="checkbox-green" />
              <Label>Push notifications</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox name="notify" value="all" color="amber" indeterminate data-testid="checkbox-indeterminate" />
              <Label>Select all</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox name="notify" value="locked" color="red" defaultChecked disabled data-testid="checkbox-disabled" />
              <Label data-testid="checkbox-disabled-label">Locked (disabled)</Label>
            </CheckboxField>
          </CheckboxGroup>

          <RadioGroup
            name="plan"
            defaultValue={plan}
            data-testid="radio-group"
            onChange={(value) => {
              plan = value
              lastChange = `plan:${value}`
              handle.update()
            }}
          >
            <RadioField>
              <Radio value="free" data-testid="radio-free" />
              <Label data-testid="radio-free-label">Free</Label>
            </RadioField>
            <RadioField>
              <Radio value="pro" color="blue" data-testid="radio-pro" />
              <Label>Pro</Label>
              <Description>Best for most teams.</Description>
            </RadioField>
            <RadioField>
              <Radio value="enterprise" color="rose" data-testid="radio-enterprise" />
              <Label>Enterprise</Label>
            </RadioField>
            <RadioField disabled>
              <Radio value="legacy" data-testid="radio-disabled" />
              <Label>Legacy (disabled)</Label>
            </RadioField>
          </RadioGroup>

          <SwitchGroup data-testid="switch-group">
            <SwitchField>
              <Label data-testid="switch-default-label">Public profile</Label>
              <Description>Anyone can see your profile.</Description>
              <Switch name="public" value="yes" defaultChecked data-testid="switch-default" />
            </SwitchField>
            <SwitchField>
              <Label>Two-factor auth</Label>
              <Switch
                name="twofa"
                value="yes"
                color="green"
                data-testid="switch-green"
                onChange={(checked) => {
                  lastChange = `twofa:${checked}`
                  handle.update()
                }}
              />
            </SwitchField>
            <SwitchField>
              <Label>Marketing emails</Label>
              <Switch name="marketing" value="yes" color="sky" data-testid="switch-sky" />
            </SwitchField>
            <SwitchField>
              <Label>White switch</Label>
              <Switch name="white" value="yes" color="white" defaultChecked data-testid="switch-white" />
            </SwitchField>
            <SwitchField disabled>
              <Label>Beta features (disabled)</Label>
              <Switch name="beta" value="yes" defaultChecked data-testid="switch-disabled" />
            </SwitchField>
          </SwitchGroup>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              data-testid="submit"
              className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Save
            </button>
            <output data-testid="last-change" className="text-sm text-muted-foreground-1">
              {lastChange}
            </output>
          </div>
        </FieldGroup>
      </Fieldset>
    </form>
  )
})
