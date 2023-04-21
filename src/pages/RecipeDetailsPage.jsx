import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../index'
import { addDoc, collection } from 'firebase/firestore'
import { Link } from 'react-router-dom'
export default function RecipeDetailsPage({ results }) {
  const [recipe, setRecipe] = useState(null)
  const { id } = useParams()
  const [recipeAdded, setRecipeAdded] = useState(false)
  // const { recipe } = results.find((recipe) => {
  // const uri = recipe.recipe.uri
  // const idFromResults = uri.substring(uri.indexOf('_') + 1, uri.length)
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
  console.log(recipe)
  const recipeCollectionsRef = collection(db, 'recipes')
  const handleAdd = async () => {
    try {
      await addDoc(recipeCollectionsRef, {
        name: recipe.label,
        edamam_id: id,
        image: recipe.image,
        user_id: 1, // hardcoded user id for now
      })
    } catch (err) {
      console.log(err)
    }
    setRecipeAdded(true)
  }
  return (
    <div>
      <h1>{recipe?.label}</h1>
      <button onClick={handleAdd} disabled={recipeAdded}>
        Add to My Recipes
      </button>
      {recipeAdded ? (
        <>
          <Link to="/my-recipes">
            <span>ADDED Go to My Recipes</span>
          </Link>
        </>
      ) : null}

      <p>
        Original Source: <Link to={recipe?.url}>{recipe?.source}</Link>
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
