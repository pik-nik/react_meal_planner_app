import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/HomePage.css'
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
    <section className="search-bar-section">
      <h1 className="search-bar-title">Find a recipe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          value={searchInput}
          className="input-box"
        />
        <button>Search</button>
      </form>
    </section>
  )
}
