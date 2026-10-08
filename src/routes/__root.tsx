import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router'
import css from '../styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Dulitha Kariyapperuma — Developer & Creative' },
      {
        name: 'description',
        content:
          'Two sides. One mind. Explore the intersection of software, intelligent systems, photography and visual storytelling.',
      },
      { name: 'theme-color', content: '#101110' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
      },
      { rel: 'stylesheet', href: css },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main">
          Skip to experience
        </a>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
  notFoundComponent: () => (
    <main id="main" className="lost">
      <p className="eyebrow">SIGNAL LOST / 404</p>
      <h1>This node does not exist.</h1>
      <Link to="/">Return to cortex ↗</Link>
    </main>
  ),
  errorComponent: () => (
    <main id="main" className="lost">
      <p className="eyebrow">CONNECTION INTERRUPTED</p>
      <h1>Something went wrong.</h1>
      <a href="/">Reload the experience ↗</a>
    </main>
  ),
})

