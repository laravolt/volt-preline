/** Kitchen-sink section for the non-interactive content components (Preline styling). */
import { clientEntry, type Handle } from 'remix/ui'

import { Avatar, AvatarButton } from '../../src/avatar.tsx'
import { Badge, BadgeButton, badgeColors } from '../../src/badge.tsx'
import { Button, buttonColors } from '../../src/button.tsx'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '../../src/description-list.tsx'
import { Divider } from '../../src/divider.tsx'
import { Heading, Subheading } from '../../src/heading.tsx'
import { PlusIcon } from '../../src/icons.tsx'
import { Stat } from '../../src/stat.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../src/table.tsx'
import { Code, Strong, Text, TextLink } from '../../src/text.tsx'

const users = [
  { handle: 'lesliealexander', name: 'Leslie Alexander', email: 'leslie@example.com', role: 'Co-Founder / CEO' },
  { handle: 'michaelfoster', name: 'Michael Foster', email: 'michael@example.com', role: 'Co-Founder / CTO' },
  { handle: 'driesvincent', name: 'Dries Vincent', email: 'dries@example.com', role: 'Business Relations' },
]

const AVATAR_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%232563eb'/%3E%3C/svg%3E"

export const Section = clientEntry(import.meta.url, function Section(_handle: Handle) {
  return () => (
    <div className="space-y-10" data-testid="content-section">
      <div className="space-y-4">
        <Subheading>Buttons</Subheading>
        <div className="flex flex-wrap gap-3" data-testid="button-colors">
          {buttonColors.map((color) => (
            <Button key={color} color={color} data-testid={`button-${color.replace('/', '-')}`}>
              {color}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button outline data-testid="button-outline">
            Outline
          </Button>
          <Button plain data-testid="button-plain">
            Plain
          </Button>
          <Button href="/?section=content#link-target" data-testid="button-href">
            Link button
          </Button>
          <Button disabled data-testid="button-disabled">
            Disabled
          </Button>
          <Button type="submit" data-testid="button-submit">
            Submit
          </Button>
          <Button color="blue" data-testid="button-icon">
            <PlusIcon />
            With icon
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Subheading>Badges</Subheading>
        <div className="flex flex-wrap gap-2" data-testid="badges">
          {badgeColors.map((color) => (
            <Badge key={color} color={color} data-testid={`badge-${color}`}>
              {color}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <BadgeButton color="lime" data-testid="badge-button">
            Badge button
          </BadgeButton>
          <BadgeButton color="sky" href="/?section=content" data-testid="badge-button-href">
            Badge link
          </BadgeButton>
        </div>
      </div>

      <div className="space-y-4">
        <Subheading>Avatars</Subheading>
        <div className="flex items-center gap-4" data-testid="avatars">
          <Avatar className="size-10" src={AVATAR_SRC} alt="Leslie Alexander" data-testid="avatar-src" />
          <Avatar className="size-10" initials="LA" alt="Leslie Alexander" data-testid="avatar-initials" />
          <Avatar className="size-10" initials="mf" data-testid="avatar-initials-hidden" />
          <Avatar className="size-10" square initials="DV" alt="Dries Vincent" data-testid="avatar-square" />
          <AvatarButton initials="AB" alt="Avatar button" className="size-10" data-testid="avatar-button" />
          <AvatarButton initials="AL" href="/?section=content" alt="Avatar link" className="size-10" data-testid="avatar-button-href" />
        </div>
      </div>

      <div className="space-y-2">
        <Heading data-testid="heading">Heading (h1)</Heading>
        <Heading level={2} data-testid="heading-level-2">
          Heading level 2
        </Heading>
        <Subheading data-testid="subheading">Subheading (h2)</Subheading>
        <Subheading level={3} data-testid="subheading-level-3">
          Subheading level 3
        </Subheading>
      </div>

      <div className="space-y-2">
        <Text data-testid="text">
          Body text with a{' '}
          <TextLink href="/?section=content" data-testid="text-link">
            text link
          </TextLink>
          , <Strong data-testid="strong">strong text</Strong> and <Code data-testid="code">inline code</Code>.
        </Text>
      </div>

      <div className="space-y-4">
        <Divider data-testid="divider" />
        <Divider soft data-testid="divider-soft" />
      </div>

      <DescriptionList data-testid="description-list">
        <DescriptionTerm>Customer</DescriptionTerm>
        <DescriptionDetails>Michael Foster</DescriptionDetails>
        <DescriptionTerm>Event</DescriptionTerm>
        <DescriptionDetails>Bear Hug: Live in Concert</DescriptionDetails>
        <DescriptionTerm>Amount</DescriptionTerm>
        <DescriptionDetails>$150.00 USD</DescriptionDetails>
      </DescriptionList>

      <div className="space-y-4">
        <Subheading>Table</Subheading>
        <Table striped dense bleed grid data-testid="table">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, i) => (
              <TableRow
                key={user.handle}
                {...(i === 0 ? { href: `/?section=content#${user.handle}`, title: user.name } : {})}
                data-testid={i === 0 ? 'table-row-href' : `table-row-${i}`}
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-muted-foreground-1">{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table data-testid="table-plain">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Role</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Plain row</TableCell>
              <TableCell>No href</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table responsive="stack" data-testid="table-stack">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, i) => (
              <TableRow key={`stack-${user.handle}`} data-testid={`table-stack-row-${i}`}>
                <TableCell stackedLabel="Name" className="font-medium">
                  {user.name}
                </TableCell>
                <TableCell stackedLabel="Email">{user.email}</TableCell>
                <TableCell stackedLabel="Role" className="text-muted-foreground-1">
                  {user.role}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-testid="stats">
        <Stat title="Total revenue" value="$2.6M" change="+4.5%" data-testid="stat-up" />
        <Stat title="Average order value" value="$455" change="-0.5%" data-testid="stat-down" />
        <Stat title="Tickets sold" value="5,888" change="+4.5%" />
        <Stat title="Pageviews" value="823,067" change="+21.2%" />
      </div>
    </div>
  )
})
