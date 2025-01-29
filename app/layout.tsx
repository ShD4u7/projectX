import { AuthProvider } from "../components/auth/AuthProvider"
import { ThemeProvider } from "next-themes"
import "../styles/globals.css"
import { MobileMenu } from "../components/MobileMenu"
import { SentryErrorBoundary } from '@/lib/monitoring/sentry-config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <title>Академия PRIDE</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <SentryErrorBoundary>
              <div className="md:hidden">
                <MobileMenu />
              </div>
              {children}
              <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </SentryErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}