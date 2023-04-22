import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '..'
import '../css/SignUpPage.css'

export default function SignUpPage() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = ({ target }) => {
    setLoginInfo({ ...loginInfo, [target.name]: target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createUserWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then((res) => {
        updateProfile(res.user, {
          displayName: loginInfo.email
            .substring(0, loginInfo.email.indexOf('@'))
            .replace('.', ''),
          photoURL:
            'https://res.cloudinary.com/doznt5vd0/image/upload/v1682155060/react_meal_plan_app/defaultUser_h6sccb.jpg',
        })
      })
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <section className="signup-section">
      <h1>Sign Up</h1>
      <form onChange={handleChange} onSubmit={handleSubmit}>
        <label htmlFor="">Email</label>
        <input type="text" value={loginInfo.email} name="email" />
        <label htmlFor="">Password</label>
        <input type="password" value={loginInfo.password} name="password" />
        <button>Sign Up</button>
      </form>
    </section>
  )
}
