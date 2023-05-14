import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, getDownloadURL } from 'firebase/storage'
import { auth, storage } from '..'
import '../css/SignUpPage.css'

export default function SignUpPage() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const handleChange = ({ target }) => {
    setError(null)
    setLoginInfo({ ...loginInfo, [target.name]: target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const defaultPath = ref(storage, 'defaultUser.jpg')
    const defaultURL = await getDownloadURL(defaultPath)
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password,
      )
      await updateProfile(newUser.user, {
        displayName: loginInfo.email
          .substring(0, loginInfo.email.indexOf('@'))
          .replace('.', ''),
        photoURL: defaultURL,
      })
      navigate(`/user/${newUser.user.uid}`)
    } catch (error) {
      setError(error.code.slice(5).replaceAll('-', ' '))
    }
  }

  return (
    <section className="signup-section">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Email</label>
        <input type="text" onChange={handleChange} name="email" />
        <label htmlFor="">Password</label>
        <input type="password" onChange={handleChange} name="password" />
        <button>Sign Up</button>
        <p>{error}</p>
      </form>
    </section>
  )
}
