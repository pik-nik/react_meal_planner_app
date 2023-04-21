import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../index'
import { addDoc, collection } from 'firebase/firestore'

export default function SearchResultsPage() {
  const [results, setResults] = useState([])
  // const [recipeToAdd, setRecipeToAdd] = useState({})
  const [recipeAdded, setRecipeAdded] = useState(false)
  const { keyword } = useParams()
  useEffect(() => {
    fetch(
      `https://api.edamam.com/search?q=${keyword}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}&from=0&to=20`,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.hits)
      })
  }, [keyword])

  const recipeCollectionsRef = collection(db, 'recipes')
  const handleAdd = async (id, { recipe }) => {
    console.log(recipe, id)
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
    <section>
      <ul>
        {results.map((result, index) => {
          const uri = result.recipe.uri
          const id = uri.substring(uri.indexOf('_') + 1, uri.length)
          return (
            <li key={index}>
              <Link to={`/recipes/${id}`}>
                <h2>{result.recipe.label}</h2>
                <img src={result.recipe.image} alt="" />
                <footer>
                  <span>{result.recipe.dietLabels}</span>
                  <span>{result.recipe.totalTime}</span>
                </footer>
              </Link>
              <button
                onClick={() => handleAdd(id, result)}
                disabled={recipeAdded}
              >
                Add to My Recipes
              </button>
              {recipeAdded ? (
                <>
                  <Link to="/my-recipes">
                    <span>ADDED Go to My Recipes</span>
                  </Link>
                </>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
