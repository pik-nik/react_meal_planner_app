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
      <Navbar expand="lg" className="menu" sticky="top">
        <Container className="container">
          <Navbar.Brand>
            <h1 className="app-name">Meal Planner </h1>
          </Navbar.Brand>
          <Link to="/">Home</Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Menu" id="basic-nav-dropdown">
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
                          <Link to="/my-recipes">My Recipes</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          <Link to="/my-meal-plans">My Meal Plans</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>
                          <button onClick={handleLogout}>Log out</button>
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
        </Container>
      </Navbar>
    </header>
  )
}
