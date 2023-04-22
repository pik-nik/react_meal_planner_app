import { Link, useNavigate } from 'react-router-dom'
import { auth } from '..'
import { signOut } from 'firebase/auth'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

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
      <Navbar bg="light" expand="lg">
        <Container>
          {user ? (
            <>
              <Navbar.Brand>
                <span>hello {user.email}</span>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <NavDropdown title="Menu" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      <Link to="/my-recipes">My Recipes</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      <Link to="/my-meal-plan">My Meal Plan</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      <Link to="/my-meal-plan">My Meal Plan</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      <button onClick={handleLogout}>Log out</button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <NavDropdown title="Menu" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      <Link to="/">Serach Recipes</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      <Link to="/login">Log in</Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </header>
  )
}
