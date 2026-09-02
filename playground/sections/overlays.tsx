import { clientEntry, on, type Handle } from 'remix/ui'
import { onMenuSelect } from 'remix/ui/menu/primitives'

import { Alert, AlertActions, AlertBody, AlertDescription, AlertTitle } from '../../src/alert.tsx'
import { Button } from '../../src/button.tsx'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../../src/dialog.tsx'
import {
  Dropdown,
  DropdownButton,
  DropdownDescription,
  DropdownDivider,
  DropdownHeader,
  DropdownHeading,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSection,
  DropdownShortcut,
  type DropdownAnchor,
} from '../../src/dropdown.tsx'

function InfoIcon() {
  return () => (
    <svg data-slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function ChevronDown() {
  return () => (
    <svg data-slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

const anchors: DropdownAnchor[] = ['top start', 'top end', 'bottom start', 'bottom end']

export const Section = clientEntry(import.meta.url, function Section(handle: Handle) {
  let dialogOpen = false
  let alertOpen = false
  let selected = 'none'
  let lastEvent = 'none'

  let update = (fn: () => void) => {
    fn()
    handle.update()
  }
  // `on()` on a component (not a host element) cannot infer the target type
  let click = (fn: () => void) => on<HTMLButtonElement, 'click'>('click', fn)
  let select = (event: { item: { name: string; value: string | null } }) =>
    update(() => (selected = event.item.value ?? event.item.name))

  return () => (
    <div className="space-y-10">
      {/* Dialog + Alert */}
      <div className="flex flex-wrap items-center gap-3">
        <Button data-testid="open-dialog" mix={click(() => update(() => (dialogOpen = true)))}>
          Open dialog
        </Button>
        <Button outline data-testid="open-alert" mix={click(() => update(() => (alertOpen = true)))}>
          Open alert
        </Button>
        <p className="text-sm text-muted-foreground-1" data-testid="modal-state">
          dialog:{String(dialogOpen)} alert:{String(alertOpen)}
        </p>
      </div>

      <Dialog data-testid="dialog" open={dialogOpen} onClose={() => update(() => (dialogOpen = false))}>
        <DialogTitle>Refund payment</DialogTitle>
        <DialogDescription>
          The refund will be reflected in the customer&rsquo;s bank account 2 to 3 business days after processing.
        </DialogDescription>
        <DialogBody>
          <label className="block text-sm font-medium text-foreground" htmlFor="refund-amount">
            Amount
          </label>
          <input
            id="refund-amount"
            data-testid="dialog-input"
            name="amount"
            placeholder="$0.00"
            className="mt-2 block w-full rounded-lg border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-primary"
          />
        </DialogBody>
        <DialogActions>
          <Button plain data-testid="dialog-cancel" mix={click(() => update(() => (dialogOpen = false)))}>
            Cancel
          </Button>
          <Button data-testid="dialog-confirm" mix={click(() => update(() => (dialogOpen = false)))}>
            Refund
          </Button>
        </DialogActions>
      </Dialog>

      <Alert data-testid="alert" open={alertOpen} onClose={() => update(() => (alertOpen = false))}>
        <AlertTitle>Are you sure you want to refund this payment?</AlertTitle>
        <AlertDescription>The refund will be reflected in the customer&rsquo;s bank account 2 to 3 business days after processing.</AlertDescription>
        <AlertBody>
          <p className="text-sm text-muted-foreground-1">This action cannot be undone.</p>
        </AlertBody>
        <AlertActions>
          <Button plain data-testid="alert-cancel" mix={click(() => update(() => (alertOpen = false)))}>
            Cancel
          </Button>
          <Button color="red" data-testid="alert-confirm" mix={click(() => update(() => (alertOpen = false)))}>
            Refund
          </Button>
        </AlertActions>
      </Alert>

      {/* Dropdowns */}
      <div
        className="flex flex-wrap items-start gap-6"
        mix={onMenuSelect((event) => update(() => (lastEvent = `${event.item.name}:${event.item.value ?? ''}`)))}
      >
        <Dropdown onSelect={select}>
          <DropdownButton data-testid="dd-default">
            Options
            <ChevronDown />
          </DropdownButton>
          <DropdownMenu data-testid="dd-default-menu">
            <DropdownItem value="edit" data-testid="item-edit">
              <InfoIcon />
              <DropdownLabel>Edit</DropdownLabel>
              <DropdownShortcut keys="⌘E" />
            </DropdownItem>
            <DropdownItem value="archive" disabled data-testid="item-archive">
              <InfoIcon />
              <DropdownLabel>Archive</DropdownLabel>
              <DropdownDescription>Disabled item</DropdownDescription>
            </DropdownItem>
            <DropdownItem value="duplicate" data-testid="item-duplicate">
              <InfoIcon />
              <DropdownLabel>Duplicate</DropdownLabel>
              <DropdownDescription>Make a copy of this item</DropdownDescription>
              <DropdownShortcut keys={['Shift', 'D']} />
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/?section=overlays#overlays" value="link" data-testid="item-link">
              <DropdownLabel>Go to overlays (link)</DropdownLabel>
            </DropdownItem>
            <DropdownItem value="delete" data-testid="item-delete">
              <DropdownLabel>Delete</DropdownLabel>
              <DropdownShortcut keys="⌘⌫" />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown label="Account" onSelect={select}>
          <DropdownButton
            as="button"
            data-testid="dd-plain"
            className="inline-flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-foreground *:data-[slot=icon]:size-4 hover:bg-muted-hover focus:bg-muted-focus focus:outline-hidden"
          >
            Plain trigger
            <ChevronDown />
          </DropdownButton>
          <DropdownMenu anchor="bottom end" data-testid="dd-plain-menu">
            <DropdownHeader>
              <div className="text-xs text-muted-foreground-1">Signed in as Tom Cook</div>
              <div className="text-sm font-semibold text-foreground">tom@example.com</div>
            </DropdownHeader>
            <DropdownDivider />
            <DropdownSection data-testid="dd-section-account">
              <DropdownHeading>Account</DropdownHeading>
              <DropdownItem value="profile">
                <InfoIcon />
                <DropdownLabel>Profile</DropdownLabel>
              </DropdownItem>
              <DropdownItem value="settings">
                <InfoIcon />
                <DropdownLabel>Settings</DropdownLabel>
                <DropdownShortcut keys="⌘," />
              </DropdownItem>
            </DropdownSection>
            <DropdownDivider />
            <DropdownSection>
              <DropdownHeading>Team</DropdownHeading>
              <DropdownItem value="invite">
                <DropdownLabel>Invite members</DropdownLabel>
              </DropdownItem>
              <DropdownItem value="billing">
                <DropdownLabel>Billing</DropdownLabel>
                <DropdownDescription>Manage plan and invoices</DropdownDescription>
              </DropdownItem>
            </DropdownSection>
            <DropdownDivider />
            <DropdownItem value="signout">
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {anchors.map((anchor) => (
          <Dropdown key={anchor} onSelect={select}>
            <DropdownButton outline data-testid={`dd-anchor-${anchor.replace(' ', '-')}`}>
              {anchor}
            </DropdownButton>
            <DropdownMenu anchor={anchor} data-testid={`dd-anchor-${anchor.replace(' ', '-')}-menu`}>
              <DropdownItem value={`${anchor}-1`}>
                <DropdownLabel>First</DropdownLabel>
              </DropdownItem>
              <DropdownItem value={`${anchor}-2`}>
                <DropdownLabel>Second</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ))}
      </div>

      <p className="text-sm text-muted-foreground-1" data-testid="selected">
        {selected}
      </p>
      <p className="text-sm text-muted-foreground-1" data-testid="last-event">
        {lastEvent}
      </p>
    </div>
  )
})
