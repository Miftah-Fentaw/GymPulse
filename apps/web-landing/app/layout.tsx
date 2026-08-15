import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GymPulse',
  description: 'Transform your fitness experience with GymPulse.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
