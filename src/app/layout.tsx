import './globals.css'
import Navigation from "./navigation";
import MainContent from "./mainContent";

export const metadata = {
  title: 'next-component',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <Navigation/>
      <MainContent/>
      </body>
    </html>
  )
}
