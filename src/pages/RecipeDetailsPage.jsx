import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
export default function RecipeDetailsPage({ results }) {
  const [recipe, setRecipe] = useState(null)
  const { id } = useParams()
  // const { recipe } = results.find((recipe) => {
  //   const uri = recipe.recipe.uri
  //   const idFromResults = uri.substring(uri.indexOf('_') + 1, uri.length)
  //   return idFromResults === id
  // })
  useEffect(() => {
    fetch(
      `https://api.edamam.com/search?q=${id}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}&from=0&to=20`,
    )
      .then((res) => res.json())
      .then((res) => {
        setRecipe(res.hits[0].recipe)
      })
  }, [id])
  return (
    <div>
      <h1>{recipe?.label}</h1>
      <p>
        from {recipe?.source}: {recipe?.url}
      </p>
      <img src={recipe?.image} alt="" />
      <ul>
        {recipe?.ingredientLines.map((ingredient, index) => {
          return <li key={index}>{ingredient}</li>
        })}
      </ul>
    </div>
  )
}
