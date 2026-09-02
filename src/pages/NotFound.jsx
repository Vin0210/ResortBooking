import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('Page Not Found')
  return (
    <div className="container notfound">
      <p className="notfound__code">404</p>
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/" className="btn btn--primary">
        Back to home
      </Link>
    </div>
  )
}
