import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LogInPage({ onLogIn }) {
  const [logInInfo, setLogInInfo] = useState({})

  const handleChange = ({ target }) => {
    setLogInInfo({ ...logInInfo, [target.name]: target.value })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    return fetch('dummy_users.json')
      .then((res) => res.json())
      .then((res) => {
        const user = res.filter((user) => user.email === logInInfo.email)
        if (user[0].password === logInInfo.password) {
          onLogIn(logInInfo)
        }
      })
  }

  return (
    <section>
      <h1>Log in</h1>
      <form onChange={handleChange} onSubmit={handleSubmit}>
        <label htmlFor="">email</label>
        <input type="text" value={logInInfo?.email} name="email" />
        <label htmlFor="">password</label>
        <input type="password" value={logInInfo?.password} name="password" />
        <button>login</button>
        <Link to="/signup">sign up</Link>
      </form>
    </section>
  )
}
