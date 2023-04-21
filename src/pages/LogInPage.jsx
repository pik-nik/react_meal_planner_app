import { useState } from 'react'

export default function LogInPage({ onLogIn }) {
  const [logInInfo, setLogInInfo] = useState({})

  const handleChange = ({ target }) => {
    setLogInInfo({ ...logInInfo, [target.name]: target.value })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    onLogIn(logInInfo)
  }

  return (
    <section>
      <h1>Log in</h1>
      <form onChange={handleChange} onSubmit={handleSubmit}>
        <input type="text" value={logInInfo.email} name="email" />
        {/* <input type="text" onChange={handleChange} value={search} name={email}/> */}
        <button>Search</button>
      </form>
    </section>
  )
}
