import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '..'
// import AlertDismissible from '../components/AlertDismissible'
import '../css/LogInPage.css'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [loginInfo, setLoginInfo] = useState({})
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = ({ target }) => {
    setError(null)
    setLoginInfo({ ...loginInfo, [target.name]: target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then((res) => {
        const uid = res.user.uid
        navigate(`/user/${uid}`)
      })
      .catch((error) => {
        setError(error.code.slice(5).replaceAll('-', ' '))
      })
  }

  return (
    <section className="login-section">
      <h1 className="login-title">Log In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Email</label>
        <input type="text" onChange={handleChange} name="email" />
        <label htmlFor="">Password</label>
        <input type="password" onChange={handleChange} name="password" />
        <button>Login</button>
        {/* {error && <AlertDismissible error={error} />} */}
        <p>{error}</p>
      </form>
      <Link to="/signup">
        <p>Not a member? Sign up here</p>
      </Link>
    </section>
  )
}
