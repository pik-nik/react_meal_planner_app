import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RandomMeal from '../components/RandomMeal'
import '../css/HomePage.css'

export default function HomePage() {
  const [searchInput, setSearchInput] = useState({})
  const navigate = useNavigate()

  const handleName = ({ target }) => {
    setSearchInput({ ...searchInput, [target.name]: target.value })
  }
  const handleFilter = ({ target }) => {
    setSearchInput({ ...searchInput, [target.name]: target.value })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const queryString =
      '?' +
      Object.entries(searchInput)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    navigate(`/search${queryString}`)
  }

  const disabled = !Object.keys(searchInput).some((key) => searchInput[key])

  return (
    <main>
      <section className="search-bar-section">
        <h1 className="search-bar-title">Find a recipe</h1>
        <form onSubmit={handleSubmit}>
          <section className="search-inputs">
            <input
              type="text"
              onChange={handleName}
              value={searchInput?.q}
              className="input-box"
              name="q"
            />
            <section className="filter">
              <label htmlFor="">Health</label>
              <select id="" onChange={handleFilter} name="health">
                <option value="">Select an Option...</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten Free</option>
                <option value="dairy-free">Milk free</option>
                <option value="vegatarian">vegatarian</option>
              </select>
              <label htmlFor="">Cusisine type</label>
              <select id="" onChange={handleFilter} name="cuisineType">
                <option value="">Select an Option...</option>
                <option value="Chinese">Chinese</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Asian">Asian</option>
              </select>
              <label htmlFor="">Meal Type</label>
              <select id="" name="mealType" onChange={handleFilter}>
                <option value="">Select an Option...</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Dinner">Dinner</option>
                <option value="Lunch">Lunch</option>
                <option value="Teatime">Tea time</option>
              </select>
            </section>
          </section>
          <button disabled={disabled}>Search</button>
        </form>
        <section className="categories">
          <h3>categories</h3>

          <div className="popular">
            <h1>popular </h1>
            <div value={'chicken'} className="chicken">
              <Link to="/search/q=chicken">chicken</Link>
            </div>
            <div value={'pasta'} className="pasta">
              <Link to="/search/q=pasta">pasta</Link>
            </div>
            <div value={'fish'} className="fish">
              <Link to="/search/q=fish">fish</Link>
            </div>
          </div>
          <RandomMeal />
        </section>
      </section>
    </main>
  )
}
