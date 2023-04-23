import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, getDownloadURL } from 'firebase/storage'
import { auth, storage } from '..'
import '../css/SignUpPage.css'

export default function SignUpPage() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = ({ target }) => {
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
      console.log(error)
    }
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
