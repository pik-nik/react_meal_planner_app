import { Link } from 'react-router-dom'

export default function NavBar({ user, onLogOut }) {
  return (
    <header>
      <nav>
        <ul>
          <li>Nav</li>
        </ul>
      </nav>
      {user && <span>hello {user.email}</span>}
      {!user ? (
        <Link to="/login">Log In</Link>
      ) : (
        <button onClick={() => onLogOut(null)}>log out</button>
      )}
    </header>
  )
}
