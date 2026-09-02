/** Registry of kitchen-sink sections. Each file exports a `Section` component (a clientEntry island). */
import type { Handle, RemixNode } from 'remix/ui'

type Component<P> = (handle: Handle<P>) => () => RemixNode

export interface SectionDef {
  id: string
  title: string
  load: () => Promise<{ Section: Component<any> }>
}

export const sections: SectionDef[] = [
  { id: 'content', title: 'Button, Badge, Avatar, Heading, Text, Divider, DescriptionList, Table, Stat', load: () => import('./content.tsx') },
  { id: 'forms', title: 'Fieldset, Input, Textarea, Select, Checkbox, Radio, Switch', load: () => import('./forms.tsx') },
  { id: 'overlays', title: 'Dialog, Alert, Dropdown', load: () => import('./overlays.tsx') },
  { id: 'selection', title: 'Listbox, Combobox', load: () => import('./selection.tsx') },
  { id: 'navigation', title: 'Sidebar, Navbar, Layouts, Pagination, Link, AuthLayout', load: () => import('./navigation.tsx') },
]
