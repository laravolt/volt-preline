/**
 * Small Heroicons (MIT) 16/20px subset — same export names as `volt-catalyst/icons` so imports are
 * drop-in. Each icon is `<svg data-slot="icon" aria-hidden="true" fill="currentColor">` so the
 * Button / Sidebar icon selectors (`*:data-[slot=icon]:…`) apply. Static markup, no hydration.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { cx, splitProps } from './utils.ts'

export type IconProps = { className?: string; class?: string } & ElementProps

function createIcon(viewBox: string, paths: () => RemixNode) {
  return function Icon(handle: Handle<IconProps>) {
    return () => {
      let { className, rest } = splitProps(handle.props)
      return (
        <svg data-slot="icon" viewBox={viewBox} fill="currentColor" aria-hidden="true" {...rest} className={cx(className)}>
          {paths()}
        </svg>
      )
    }
  }
}

const evenodd = { fillRule: 'evenodd', clipRule: 'evenodd' } as const

export const ChevronLeft = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" />
))
export const ChevronLeftIcon = ChevronLeft

export const ChevronRight = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" />
))
export const ChevronRightIcon = ChevronRight

export const ChevronDown = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" />
))
export const ChevronDownIcon = ChevronDown

export const ChevronUp = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" />
))
export const ChevronUpIcon = ChevronUp

export const MagnifyingGlass = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
))
export const MagnifyingGlassIcon = MagnifyingGlass

export const EllipsisVertical = createIcon('0 0 16 16', () => (
  <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
))
export const EllipsisVerticalIcon = EllipsisVertical

export const Banknotes = createIcon('0 0 16 16', () => (
  <path d="M1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Zm7 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM2.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm0 7a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm11-7a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm0 7a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
))
export const BanknotesIcon = Banknotes

export const CreditCard = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M2 3a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2Zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7ZM3 10.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm6 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z" />
))
export const CreditCardIcon = CreditCard

export const Calendar = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM3.5 6v6a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V6h-9Z" />
))
export const CalendarIcon = Calendar

export const Home = createIcon('0 0 20 20', () => (
  <path {...evenodd} d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" />
))
export const HomeIcon = Home

export const Square2Stack = createIcon('0 0 20 20', () => (
  <>
    <path d="M6.5 3A1.5 1.5 0 0 0 5 4.5v7A1.5 1.5 0 0 0 6.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-7Z" />
    <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v7A1.5 1.5 0 0 0 3.5 16h7a1.5 1.5 0 0 0 1.5-1.5v-1a.75.75 0 0 0-1.5 0v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h1a.75.75 0 0 0 0-1.5h-1Z" />
  </>
))
export const Square2StackIcon = Square2Stack

export const Ticket = createIcon('0 0 20 20', () => (
  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v2.793a2.5 2.5 0 0 1 0 4.414V14.5A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-2.793a2.5 2.5 0 0 1 0-4.414V4.5A1.5 1.5 0 0 0 17.5 3h-15ZM6 6.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 6.75Zm0 3.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Zm.75 2.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" />
))
export const TicketIcon = Ticket

export const Cog6Tooth = createIcon('0 0 20 20', () => (
  <path {...evenodd} d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
))
export const Cog6ToothIcon = Cog6Tooth

export const Cog8Tooth = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M6.936 1.127a.75.75 0 0 1 .878 0l.455.33a5.55 5.55 0 0 1 1.05.992l.545-.138a.75.75 0 0 1 .808.335l.75 1.3a.75.75 0 0 1-.157.925l-.417.382c.162.433.27.886.32 1.353l.558.077a.75.75 0 0 1 .644.743v1.5a.75.75 0 0 1-.644.743l-.558.077a5.57 5.57 0 0 1-.32 1.353l.417.382a.75.75 0 0 1 .157.925l-.75 1.3a.75.75 0 0 1-.808.335l-.545-.138c-.324.372-.68.706-1.05.992l-.455.33a.75.75 0 0 1-.878 0l-.455-.33a5.55 5.55 0 0 1-1.05-.992l-.545.138a.75.75 0 0 1-.808-.335l-.75-1.3a.75.75 0 0 1 .157-.925l.417-.382a5.57 5.57 0 0 1-.32-1.353l-.558-.077a.75.75 0 0 1-.644-.743v-1.5a.75.75 0 0 1 .644-.743l.558-.077c.05-.467.158-.92.32-1.353l-.417-.382a.75.75 0 0 1-.157-.925l.75-1.3a.75.75 0 0 1 .808-.335l.545.138c.324-.372.68-.706 1.05-.992l.455-.33ZM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
))
export const Cog8ToothIcon = Cog8Tooth

export const QuestionMarkCircle = createIcon('0 0 20 20', () => (
  <path {...evenodd} d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.724.41-1.382 1.06-1.706a1.5 1.5 0 1 0-1.37-2.104ZM9 13a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
))
export const QuestionMarkCircleIcon = QuestionMarkCircle

export const Sparkles = createIcon('0 0 20 20', () => (
  <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a8.032 8.032 0 0 1-6.2 6.2l-1.192.24a1 1 0 0 0 0 1.96l1.192.24a8.032 8.032 0 0 1 6.2 6.2l.24 1.192a1 1 0 0 0 1.96 0l.24-1.192a8.032 8.032 0 0 1 6.2-6.2l1.192-.24a1 1 0 0 0 0-1.96l-1.192-.24a8.032 8.032 0 0 1-6.2-6.2l-.24-1.192ZM4.394 2.21a.75.75 0 0 0-1.464 0l-.13.65a4.015 4.015 0 0 1-3.1 3.1l-.65.13a.75.75 0 0 0 0 1.464l.65.13a4.015 4.015 0 0 1 3.1 3.1l.13.65a.75.75 0 0 0 1.464 0l.13-.65a4.015 4.015 0 0 1 3.1-3.1l.65-.13a.75.75 0 0 0 0-1.464l-.65-.13a4.015 4.015 0 0 1-3.1-3.1l-.13-.65Z" />
))
export const SparklesIcon = Sparkles

export const Plus = createIcon('0 0 16 16', () => (
  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
))
export const PlusIcon = Plus

export const UserCircle = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM5.5 6a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM3.79 12.067a5.5 5.5 0 0 1 8.42 0A5.474 5.474 0 0 1 8 13.5a5.474 5.474 0 0 1-4.21-1.433Z" />
))
export const UserCircleIcon = UserCircle

export const ShieldCheck = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M8 1.077A1.5 1.5 0 0 0 6.643 2.05l-.83 1.937a1.5 1.5 0 0 1-.84.773l-2.023.708a1.5 1.5 0 0 0-1.026 1.419v2.664c0 3.82 2.76 6.84 5.75 7.426a1.5 1.5 0 0 0 .652 0c2.99-.586 5.75-3.606 5.75-7.426V6.887a1.5 1.5 0 0 0-1.026-1.42l-2.023-.707a1.5 1.5 0 0 1-.84-.773l-.83-1.937A1.5 1.5 0 0 0 8 1.077Zm2.78 5.703a.75.75 0 0 0-1.06-1.06L7.25 8.19 6.28 7.22a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3-3Z" />
))
export const ShieldCheckIcon = ShieldCheck

export const LightBulb = createIcon('0 0 16 16', () => (
  <path d="M8 1.5a4.5 4.5 0 0 0-3.182 7.682c.5.5.94 1.135 1.075 1.818h4.214c.135-.683.575-1.318 1.075-1.818A4.5 4.5 0 0 0 8 1.5ZM6 12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.5H6v.5ZM7 14.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V14H7v.5Z" />
))
export const LightBulbIcon = LightBulb

export const ArrowRightStartOnRectangle = createIcon('0 0 16 16', () => (
  <path {...evenodd} d="M3 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4.5a.75.75 0 0 0 0-1.5H3.5V3.5h4a.75.75 0 0 0 0-1.5H3Zm8.28 3.22a.75.75 0 0 0-1.06 1.06L11.94 8l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25ZM6.5 8a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 6.5 8Z" />
))
export const ArrowRightStartOnRectangleIcon = ArrowRightStartOnRectangle

export const Inbox = createIcon('0 0 20 20', () => (
  <path
    fillRule='evenodd'
    clipRule='evenodd'
    d='M1 11.27c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 0 1 5.273 3h9.454a2.75 2.75 0 0 1 2.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3.73Zm3.068-5.852A1.25 1.25 0 0 1 5.273 4.5h9.454a1.25 1.25 0 0 1 1.205.918l1.523 5.52c.006.02.01.041.015.062H14a1 1 0 0 0-.86.49l-.606 1.02a1 1 0 0 1-.86.49H8.236a1 1 0 0 1-.894-.553l-.448-.894A1 1 0 0 0 6 11H2.53l.015-.062 1.523-5.52Z'
  />
))
export const InboxIcon = Inbox
