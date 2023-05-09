import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { randomRecipes } from '../data'

export default function RandomMeal() {
  const [randomMeals, setRandomMeals] = useState([])
  const randomQuery =
    randomRecipes[Math.floor(Math.random() * randomRecipes.length)]
  const randomNumber = Math.floor(Math.random() * 100)

  useEffect(() => {
    const url = `https://api.edamam.com/search?q=${randomQuery}&app_id=${
      process.env.REACT_APP_EDAMAM_APP_ID
    }&app_key=${
      process.env.REACT_APP_EDAMAM_API_KEY
    }&random=true&from=${randomNumber}&to=${randomNumber + 4}`

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setRandomMeals(res.hits)
      })
  }, [])

  return (
    <section className="random">
      <h1>Random Recipes</h1>
      {randomMeals.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="random-recipes">
          {randomMeals.map((meal, index) => {
            const uri = meal.recipe.uri
            const id = uri.substring(uri.indexOf('_') + 1, uri.length)
            return (
              <div key={index} className="random-recipe">
                <Link to={`/recipes/${id}`}>
                  <img src={meal.recipe.image} alt={meal.recipe.label} />
                  <h4>{meal.recipe.label}</h4>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
