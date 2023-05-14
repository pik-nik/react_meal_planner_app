import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Link } from 'react-router-dom'

export default function LoginModal({ showLogin, setShowLogin }) {
  const handleClose = () => setShowLogin(false)
  //   const handleLogin = () => {
  //     setShowLogin(false)

  //   }

  return (
    <Modal show={showLogin} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>You&apos;re not logged in!</Modal.Title>
      </Modal.Header>
      <Modal.Body>Please log in or sign up to add recipes</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Link to={'/login'}>
          <Button variant="success" onClick={handleClose}>
            Log in
          </Button>
        </Link>
        <Link to={'/signup'}>
          <Button variant="success" onClick={handleClose}>
            Sign up
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  )
}
