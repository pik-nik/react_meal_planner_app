import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function HomePage() {
  const [searchInput, setSearchInput] = useState([])
  const navigate = useNavigate()

  const handleChange = ({ target }) => {
    setSearchInput(target.value)
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    navigate(`/search/${searchInput}`)
  }

  return (
    <section>
      <h1>Find a recipe</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} value={searchInput} />
        <button>Search</button>
      </form>
    </section>
  )
}
