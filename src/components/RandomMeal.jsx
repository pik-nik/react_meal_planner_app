import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function RandomMeal() {
  const [ranMeals, setranMeals] = useState([])

  const mealParams = [
    'chicken',
    'beef',
    'fish',
    'tofu',
    'soup',
    'pasta',
    'curry',
    'ramen',
  ]

  let ranParam = mealParams[Math.floor(Math.random() * mealParams.length)]

  useEffect(() => {
    let url = `https://api.edamam.com/search?q=${ranParam}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}&from=0&to=3&random=true`

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setranMeals(res.hits)
      })
  }, [])

  return (
    <section className="random">
      <h3>random Meals</h3>
      {ranMeals.map((meal, index) => {
        const uri = meal.recipe.uri
        const id = uri.substring(uri.indexOf('_') + 1, uri.length)
        return (
          <div key={index}>
            <Link to={`/recipes/${id}`}>
              <h2>{meal.recipe.label}</h2>
              <img src={meal.recipe.image} alt="" />
            </Link>
          </div>
        )
      })}
    </section>
  )
}
