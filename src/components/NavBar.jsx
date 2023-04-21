import { Link, useNavigate } from 'react-router-dom'
import { auth } from '..'
import { signOut } from 'firebase/auth'

export default function NavBar({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        onLogout(null)
        navigate('/')
      })
      .catch((error) => console.log(error))
  }

  return (
    <header>
      <nav>
        {user ? (
          <>
            <span>hello {user.email}</span>
            <Link to="/my-recipes">My Recipes</Link>
            <Link to="/my-meal-plan">My Meal Plan</Link>
            <button onClick={handleLogout}>log out</button>
          </>
        ) : (
          <Link to="/login">login</Link>
        )}
      </nav>
    </header>
  )
}
