import type { Story } from '@ladle/react'
import { Button } from '@/components/ui/button'

export const AllVariants: Story = () => (
  <div className="flex flex-wrap gap-4 p-8">
    <Button variant="default">Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="link">Link</Button>
  </div>
)

export const AllSizes: Story = () => (
  <div className="flex flex-wrap items-center gap-4 p-8">
    <Button size="xs">XS</Button>
    <Button size="sm">SM</Button>
    <Button size="default">Default</Button>
    <Button size="lg">LG</Button>
  </div>
)

export const IconSizes: Story = () => (
  <div className="flex flex-wrap items-center gap-4 p-8">
    <Button size="icon-xs">+</Button>
    <Button size="icon-sm">+</Button>
    <Button size="icon">+</Button>
    <Button size="icon-lg">+</Button>
  </div>
)

export const Disabled: Story = () => (
  <div className="flex flex-wrap gap-4 p-8">
    <Button disabled variant="default">Disabled</Button>
    <Button disabled variant="secondary">Disabled</Button>
    <Button disabled variant="outline">Disabled</Button>
  </div>
)
