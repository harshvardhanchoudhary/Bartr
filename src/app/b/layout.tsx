import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'BARTR-B — Trade skills, earn Credits',
    template: '%s | BARTR-B',
  },
  description: 'Skills and services barter marketplace. Deliver work, earn Credits, spend them on any skill in the network.',
}

export default function BartrBLayout({ children }: { children: React.ReactNode }) {
  return children
}
