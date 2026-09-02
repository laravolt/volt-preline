/** Kitchen-sink section: Sidebar, Navbar, SidebarLayout, StackedLayout, Pagination, Link, AuthLayout. */
import { clientEntry, on, type Handle, type RemixNode } from 'remix/ui'

import { Avatar } from '../../src/avatar.tsx'
import {
  ChevronDownIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  Square2StackIcon,
  TicketIcon,
  UserCircleIcon,
} from '../../src/icons.tsx'
import { AuthLayout } from '../../src/auth-layout.tsx'
import { Link } from '../../src/link.tsx'
import { Navbar, NavbarDivider, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from '../../src/navbar.tsx'
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '../../src/pagination.tsx'
import { SidebarLayout } from '../../src/sidebar-layout.tsx'
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '../../src/sidebar.tsx'
import { StackedLayout } from '../../src/stacked-layout.tsx'

function DemoSidebar(handle: Handle<{ testid: string; current: string }>) {
  return () => {
    let { testid, current } = handle.props
    return (
      <Sidebar data-testid={testid}>
        <SidebarHeader>
          <SidebarSection>
            <SidebarItem href="#" aria-label="Team">
              <Avatar initials="P" square className="size-5 bg-primary text-primary-foreground" />
              <SidebarLabel>Preline</SidebarLabel>
              <ChevronDownIcon />
            </SidebarItem>
          </SidebarSection>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarItem href="#home" current={current === 'home'}>
              <HomeIcon />
              <SidebarLabel>Home</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#events" current={current === 'events'}>
              <TicketIcon />
              <SidebarLabel>Events</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#orders" current={current === 'orders'}>
              <Square2StackIcon />
              <SidebarLabel>Orders</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
          <SidebarDivider />
          <SidebarSection>
            <SidebarHeading>Upcoming events</SidebarHeading>
            <SidebarItem href="#e1">Bear Hug: Live in Concert</SidebarItem>
            <SidebarItem href="#e2">Viking People</SidebarItem>
          </SidebarSection>
          <SidebarSpacer />
          <SidebarSection>
            <SidebarItem href="#support">
              <QuestionMarkCircleIcon />
              <SidebarLabel>Support</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarBody>
        <SidebarFooter>
          <SidebarSection>
            <SidebarItem href="#profile">
              <UserCircleIcon />
              <SidebarLabel>Erica</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarFooter>
      </Sidebar>
    )
  }
}

function DemoNavbar(handle: Handle<{ children?: RemixNode }>) {
  return () => (
    <Navbar>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="#search" aria-label="Search">
          <MagnifyingGlassIcon />
        </NavbarItem>
        <NavbarItem href="#inbox" aria-label="Inbox">
          <InboxIcon />
        </NavbarItem>
      </NavbarSection>
      {handle.props.children}
    </Navbar>
  )
}

const inputClasses =
  'block w-full rounded-lg border-layer-line bg-layer px-4 py-2.5 text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus sm:py-3 sm:text-sm'

export const Section = clientEntry(import.meta.url, function Section(handle: Handle) {
  type Tab = 'home' | 'events' | 'orders'
  let activeTab: Tab = 'home'
  let tabs: Array<{ id: Tab; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'orders', label: 'Orders' },
  ]

  return () => (
    <div className="space-y-12">
      {/* SidebarLayout */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground-1">SidebarLayout (fixed-height preview)</h3>
        <div
          data-testid="sidebar-layout-demo"
          className="relative h-[640px] overflow-hidden rounded-xl border border-card-line [transform:translateZ(0)]"
        >
          <SidebarLayout
            data-testid="sidebar-layout"
            navbar={<DemoNavbar />}
            sidebar={<DemoSidebar testid="sidebar" current="events" />}
          >
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground-1">Content inside SidebarLayout.</p>
          </SidebarLayout>
        </div>
      </div>

      {/* StackedLayout */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground-1">StackedLayout (fixed-height preview)</h3>
        <div
          data-testid="stacked-layout-demo"
          className="relative h-[480px] overflow-hidden rounded-xl border border-card-line [transform:translateZ(0)]"
        >
          <StackedLayout
            data-testid="stacked-layout"
            navbar={
              <Navbar>
                <NavbarItem href="#" aria-label="Team">
                  <Avatar initials="P" square className="size-5 bg-primary text-primary-foreground" />
                  <NavbarLabel>Preline</NavbarLabel>
                  <ChevronDownIcon />
                </NavbarItem>
                <NavbarDivider className="max-lg:hidden" />
                <NavbarSection className="max-lg:hidden">
                  <NavbarItem href="#home" current>
                    Home
                  </NavbarItem>
                  <NavbarItem href="#events">Events</NavbarItem>
                  <NavbarItem href="#orders">Orders</NavbarItem>
                </NavbarSection>
                <NavbarSpacer />
                <NavbarSection>
                  <NavbarItem href="#search" aria-label="Search">
                    <MagnifyingGlassIcon />
                  </NavbarItem>
                </NavbarSection>
              </Navbar>
            }
            sidebar={<DemoSidebar testid="stacked-sidebar" current="home" />}
          >
            <h1 className="text-2xl font-semibold">Stacked</h1>
            <p className="mt-2 text-sm text-muted-foreground-1">Content inside StackedLayout.</p>
          </StackedLayout>
        </div>
      </div>

      {/* Standalone Navbar with interactive current indicator */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground-1">Navbar (click an item to move the indicator)</h3>
        <div className="rounded-xl border border-navbar-line bg-navbar px-4">
          <Navbar data-testid="navbar">
            <NavbarItem href="#" aria-label="Team">
              <Avatar initials="P" square className="size-5 bg-primary text-primary-foreground" />
              <NavbarLabel>Preline</NavbarLabel>
              <ChevronDownIcon />
            </NavbarItem>
            <NavbarDivider />
            <NavbarSection data-testid="navbar-tabs">
              {tabs.map((tab) => (
                <NavbarItem
                  key={tab.id}
                  data-testid={`navbar-tab-${tab.id}`}
                  current={activeTab === tab.id}
                  mix={on<HTMLButtonElement>('click', () => {
                    activeTab = tab.id
                    handle.update()
                  })}
                >
                  <NavbarLabel>{tab.label}</NavbarLabel>
                </NavbarItem>
              ))}
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
              <NavbarItem href="#search" aria-label="Search">
                <MagnifyingGlassIcon />
              </NavbarItem>
              <NavbarItem href="#inbox" aria-label="Inbox">
                <InboxIcon />
              </NavbarItem>
            </NavbarSection>
          </Navbar>
        </div>
        <p className="mt-2 text-xs text-muted-foreground-1" data-testid="navbar-active">
          Active: {activeTab}
        </p>
      </div>

      {/* Pagination */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground-1">Pagination</h3>
        <Pagination data-testid="pagination">
          <PaginationPrevious href="?page=2" />
          <PaginationList>
            <PaginationPage href="?page=1">1</PaginationPage>
            <PaginationPage href="?page=2">2</PaginationPage>
            <PaginationPage href="?page=3" current>
              3
            </PaginationPage>
            <PaginationPage href="?page=4">4</PaginationPage>
            <PaginationGap />
            <PaginationPage href="?page=65">65</PaginationPage>
            <PaginationPage href="?page=66">66</PaginationPage>
          </PaginationList>
          <PaginationNext href="?page=4" />
        </Pagination>
        <Pagination data-testid="pagination-first" className="mt-4" aria-label="First page pagination">
          <PaginationPrevious />
          <PaginationList>
            <PaginationPage href="?page=1" current>
              1
            </PaginationPage>
            <PaginationPage href="?page=2">2</PaginationPage>
          </PaginationList>
          <PaginationNext href="?page=2" />
        </Pagination>
      </div>

      {/* Links */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground-1">Link</h3>
        <p className="space-x-4 text-sm">
          <Link data-testid="link-internal" href="/?section=navigation" className="font-medium text-primary decoration-2 hover:underline">
            Internal link
          </Link>
          <Link
            data-testid="link-external"
            href="https://example.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary decoration-2 hover:underline"
          >
            External link
          </Link>
        </p>
      </div>

      {/* AuthLayout */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground-1">AuthLayout</h3>
        <div className="overflow-hidden rounded-xl border border-card-line bg-background-1">
          <AuthLayout data-testid="auth-layout" className="min-h-[520px]! bg-transparent!">
            <form action="/echo" method="post" className="grid grid-cols-1 gap-5" data-testid="auth-form">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
                <p className="mt-2 text-sm text-muted-foreground-2">
                  Don't have an account yet?{' '}
                  <Link href="#signup" className="font-medium text-primary decoration-2 hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
              <label className="block text-sm">
                <span className="mb-2 block font-medium text-foreground">Email address</span>
                <input type="email" name="email" autoComplete="email" className={inputClasses} />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block font-medium text-foreground">Password</span>
                <input type="password" name="password" autoComplete="current-password" className={inputClasses} />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-primary-line bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover focus:bg-primary-focus focus:outline-hidden"
              >
                Sign in
              </button>
            </form>
          </AuthLayout>
        </div>
      </div>
    </div>
  )
})
