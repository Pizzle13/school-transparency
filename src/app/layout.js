import './globals.css'

export const metadata = {
  title: 'School Transparency',
  description: 'Data-driven insights for international teachers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}