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
        <>
          <Link to="/my-recipes">
            <p>My Recipes</p>
          </Link>
          <Link to="/my-meal-plan">
            <p>My Meal Plan</p>
          </Link>
          <button onClick={() => onLogOut(null)}>log out</button>
        </>
      )}
    </header>
  )
}
