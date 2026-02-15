import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import Footer from '../components/common/Footer'

export const metadata = {
  title: 'School Transparency',
  description: 'Data-driven insights for international teachers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}