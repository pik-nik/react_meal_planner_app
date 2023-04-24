import { Link, useNavigate } from 'react-router-dom'
import { auth } from '..'
import { signOut } from 'firebase/auth'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import '../css/NavBar.css'

export default function NavBar({ user, loading }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login')
      })
      .catch((error) => console.log(error))
  }

  return (
    <header className="navbar-header">
      <h1 className="app-name">Meal Plan</h1>
      <Navbar expand="lg" className="menu" sticky="top">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown id="basic-nav-dropdown">
              {loading ? (
                <NavDropdown.Item>
                  <p>Loading...</p>
                </NavDropdown.Item>
              ) : (
                <>
                  {user ? (
                    <>
                      <NavDropdown.Item>
                        <Link to={`/user/${user.uid}`}>
                          Hello {user.displayName}
                        </Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item>
                        <Link to="/">Home</Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item>
                        <Link to="/my-recipes">My Recipes</Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item>
                        <Link to="/my-meal-plans">My Meal Plans</Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        <button className="btn-menu" onClick={handleLogout}>
                          Log out
                        </button>
                      </NavDropdown.Item>
                    </>
                  ) : (
                    <>
                      <NavDropdown.Item>
                        <Link to="/login">Log in</Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item>
                        <Link to="/signup">Sign Up</Link>
                      </NavDropdown.Item>
                    </>
                  )}
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}
