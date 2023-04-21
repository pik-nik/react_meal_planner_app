import { useEffect, useState } from 'react'
import { db } from '../index'
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore'
export default function MyRecipesPage() {
  const getRecipeList = async () => {
    // Read the data from db
    const recipeCollectionsRef = collection(db, 'recipes')
    try {
      const data = await getDocs(recipeCollectionsRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      // Set the recipe list
      setRecipeList(filteredData)
    } catch (err) {
      console.log(err)
    }
  }
  const [recipeList, setRecipeList] = useState([])
  useEffect(() => {
    getRecipeList()
  }, [])

  const deleteRecipe = async (id) => {
    const recipeDoc = doc(db, 'recipes', id)
    await deleteDoc(recipeDoc)
    getRecipeList()
  }

  return (
    <section>
      <h1>My recipes</h1>
      <div>
        {recipeList.map((recipe) => {
          return (
            <div key={recipe.id}>
              <h1>{recipe.name}</h1>
              <img src={recipe.image} alt="" />
              <button onClick={() => deleteRecipe(recipe.id)}>
                Delete Recipe
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
