import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '..'

export default function LoginPage({ onLogin }) {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = ({ target }) => {
    setLoginInfo({ ...loginInfo, [target.name]: target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then((userCredential) => {
        const user = userCredential.user
        navigate('/')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <section>
      <h1>Log In</h1>
      <form onChange={handleChange} onSubmit={handleSubmit}>
        <label htmlFor="">Email</label>
        <input type="text" value={loginInfo.email} name="email" />
        <label htmlFor="">Password</label>
        <input type="password" value={loginInfo.password} name="password" />
        <button>Login</button>
      </form>
      <Link to="/signup">Sign Ip</Link>
    </section>
  )
}
