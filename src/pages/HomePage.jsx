import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage({ onSearch }) {
  const [search, setSearch] = useState([])

  const handleChange = ({ target }) => {
    setSearch(target.value)
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    fetch(
      `https://api.edamam.com/search?q=${search}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}`,
    )
      .then((res) => res.json())
      .then((res) => onSearch(res.hits))
  }

  return (
    <section>
      <Link to="/login">Log In</Link>
      <h1>Find a recipe</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} value={search} />
        <button>Search</button>
      </form>
    </section>
  )
}
