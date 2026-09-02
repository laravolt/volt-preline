import { clientEntry, ref, type Handle } from 'remix/ui'

import { Combobox, ComboboxDescription, ComboboxLabel, ComboboxOption } from '../../src/combobox.tsx'
import { Listbox, ListboxDescription, ListboxLabel, ListboxOption } from '../../src/listbox.tsx'

type Person = { id: number; name: string; role: string }

const people: Person[] = [
  { id: 1, name: 'Alice Johnson', role: 'Engineering' },
  { id: 2, name: 'Bob Martinez', role: 'Design' },
  { id: 3, name: 'Carol Nguyen', role: 'Product' },
  { id: 4, name: 'Dave Okafor', role: 'Marketing' },
  { id: 5, name: 'Erin Kowalski', role: 'Sales' },
]

// Remix JSX cannot infer generic props from attributes; instantiate the components once.
const PersonCombobox = Combobox as typeof Combobox<Person>
const PersonComboboxOption = ComboboxOption as typeof ComboboxOption<Person>

const assignees = [
  { value: 'alice', label: 'Alice', description: 'Engineering' },
  { value: 'bob', label: 'Bob', description: 'Design', disabled: true },
  { value: 'carol', label: 'Carol', description: 'Product' },
  { value: 'dave', label: 'Dave', description: 'Marketing' },
  { value: 'wade', label: 'Wade', description: 'Support' },
]

export const Section = clientEntry(import.meta.url, function Section(handle: Handle) {
  let hydrated = false
  let listboxValue: string | null = 'wade'
  let comboboxValue: Person | null = null

  return () => (
    <form
      method="post"
      action="/echo"
      data-rmx-document
      data-testid="selection-form"
      data-hydrated={hydrated ? '' : undefined}
      className="max-w-md space-y-6"
      mix={ref(() => {
        hydrated = true
        void handle.update()
      })}
    >
      <div className="space-y-2">
        <label htmlFor="assignee" className="block text-sm font-medium">
          Assignee (Listbox, preselected)
        </label>
        <Listbox
          id="assignee"
          name="assignee"
          placeholder="Select an assignee&hellip;"
          defaultValue={listboxValue}
          onChange={(value) => {
            listboxValue = value
            void handle.update()
          }}
          data-testid="listbox"
        >
          {assignees.map((person) => (
            <ListboxOption key={person.value} value={person.value} disabled={person.disabled} data-testid={`listbox-option-${person.value}`}>
              <ListboxLabel>{person.label}</ListboxLabel>
              <ListboxDescription>{person.description}</ListboxDescription>
            </ListboxOption>
          ))}
        </Listbox>
        <p data-testid="listbox-value" className="text-sm text-muted-foreground">
          {listboxValue ?? ''}
        </p>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium">Listbox with placeholder</span>
        <Listbox name="priority" placeholder="Choose a priority" aria-label="Priority" data-testid="listbox-placeholder">
          <ListboxOption value="low">
            <ListboxLabel>Low</ListboxLabel>
          </ListboxOption>
          <ListboxOption value="medium">
            <ListboxLabel>Medium</ListboxLabel>
          </ListboxOption>
          <ListboxOption value="high">
            <ListboxLabel>High</ListboxLabel>
          </ListboxOption>
        </Listbox>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium">Disabled Listbox</span>
        <Listbox name="disabled_listbox" placeholder="Disabled" disabled aria-label="Disabled listbox" data-testid="listbox-disabled">
          <ListboxOption value="a">
            <ListboxLabel>Option A</ListboxLabel>
          </ListboxOption>
          <ListboxOption value="b">
            <ListboxLabel>Option B</ListboxLabel>
          </ListboxOption>
        </Listbox>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium">Invalid Listbox</span>
        <Listbox name="invalid_listbox" placeholder="Pick one" invalid aria-label="Invalid listbox" data-testid="listbox-invalid">
          <ListboxOption value="x">
            <ListboxLabel>Option X</ListboxLabel>
          </ListboxOption>
          <ListboxOption value="y">
            <ListboxLabel>Option Y</ListboxLabel>
          </ListboxOption>
        </Listbox>
      </div>

      <div className="space-y-2">
        <label htmlFor="person" className="block text-sm font-medium">
          Person (Combobox)
        </label>
        <PersonCombobox
          id="person"
          name="person"
          options={people}
          displayValue={(person) => person?.name}
          valueKey={(person) => String(person.id)}
          placeholder="Search people&hellip;"
          defaultValue={comboboxValue}
          onChange={(person) => {
            comboboxValue = person
            void handle.update()
          }}
          data-testid="combobox"
        >
          {(person) => (
            <PersonComboboxOption value={person} data-testid={`combobox-option-${person.id}`}>
              <ComboboxLabel>{person.name}</ComboboxLabel>
              <ComboboxDescription>{person.role}</ComboboxDescription>
            </PersonComboboxOption>
          )}
        </PersonCombobox>
        <p data-testid="combobox-value" className="text-sm text-muted-foreground">
          {comboboxValue ? `${comboboxValue.id}:${comboboxValue.name}` : ''}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="person-preselected" className="block text-sm font-medium">
          Preselected Combobox
        </label>
        <PersonCombobox
          id="person-preselected"
          name="person_preselected"
          options={people}
          displayValue={(person) => person?.name}
          valueKey={(person) => String(person.id)}
          defaultValue={people[2]}
          data-testid="combobox-preselected"
        >
          {(person) => (
            <PersonComboboxOption value={person}>
              <ComboboxLabel>{person.name}</ComboboxLabel>
            </PersonComboboxOption>
          )}
        </PersonCombobox>
      </div>

      <div className="space-y-2">
        <label htmlFor="person-invalid" className="block text-sm font-medium">
          Invalid + disabled Combobox
        </label>
        <div className="space-y-2">
          <PersonCombobox
            id="person-invalid"
            name="person_invalid"
            options={people}
            displayValue={(person) => person?.name}
            valueKey={(person) => String(person.id)}
            placeholder="Required"
            invalid
            data-testid="combobox-invalid"
          >
            {(person) => (
              <PersonComboboxOption value={person}>
                <ComboboxLabel>{person.name}</ComboboxLabel>
              </PersonComboboxOption>
            )}
          </PersonCombobox>
          <PersonCombobox
            name="person_disabled"
            options={people}
            displayValue={(person) => person?.name}
            valueKey={(person) => String(person.id)}
            placeholder="Disabled"
            disabled
            aria-label="Disabled combobox"
            data-testid="combobox-disabled"
          >
            {(person) => (
              <PersonComboboxOption value={person}>
                <ComboboxLabel>{person.name}</ComboboxLabel>
              </PersonComboboxOption>
            )}
          </PersonCombobox>
        </div>
      </div>

      <button
        type="submit"
        data-testid="submit"
        className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover focus:outline-hidden"
      >
        Submit
      </button>
    </form>
  )
})
