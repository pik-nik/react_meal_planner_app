import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/HomePage.css'
import { AiFillBoxPlot } from 'react-icons/ai'
export default function HomePage({ setSearch }) {
  const [searchInput, setSearchInput] = useState({})
  const navigate = useNavigate()

  const handleChange = ({ target }) => {
    setSearchInput({ ...searchInput, [target.name]: target.value })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    setSearch(searchInput)
    navigate(`/search/${searchInput.q}`)
  }

  const handleOption = ({ target }) => {
    //console.log(e.target.value)
    setSearchInput({ ...searchInput, [target.name]: target.value })
  }

  return (
    <section className="search-bar-section">
      <h1 className="search-bar-title">Find a recipe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          value={searchInput?.q}
          className="input-box"
          name="q"
        />
        <button>Search</button>
      </form>
      <section className="filter">
        <label htmlFor="">Health</label>
        <select id="" onChange={handleOption} name="health">
          <option value=""></option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
          <option value="dairy-free">Milk free</option>
          <option value="vegatarian">vegatarian</option>
        </select>
        <label htmlFor="">Cusisine type</label>
        <select id="" onChange={handleOption} name="cuisineType">
          <option value=""></option>
          <option value="Chinese">Chinese</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Asian">Asian</option>
        </select>
        <label htmlFor="">Meal Type</label>
        <select id="" name="mealType" onChange={handleOption}>
          <option value=""></option>
          <option value="Breakfast">Breakfast</option>
          <option value="Dinner">Dinner</option>
          <option value="Lunch">Lunch</option>
          <option value="Teatime">Tea time</option>
        </select>
      </section>
    </section>
  )
}
