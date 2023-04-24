import { useEffect, useState } from 'react'
import { db } from '../index'
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import '../css/MyRecipesPage.css'
import Pagination from '../components/Pagination'
import AddToMealplanPopUp from '../components/AddToMealplanPopUp'
export default function MyRecipesPage({ user, loading }) {
  const [recipeList, setRecipeList] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  // Read the data from db
  const recipeCollectionsRef = collection(db, 'recipes')
  // get current displayed posts
  const resultsPerPage = 10
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = recipeList.slice(indexOfFirstResult, indexOfLastResult)

  const getRecipeList = async () => {
    const q = query(
      recipeCollectionsRef,
      //if user anth is done, uncomment the next line
      where('user_id', '==', user.uid),
      orderBy('createdAt', 'desc'),
    )
    try {
      const data = await getDocs(q)
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

  useEffect(() => {
    getRecipeList()
  }, [loading])

  const deleteRecipe = async (id) => {
    const recipeDoc = doc(db, 'recipes', id)
    await deleteDoc(recipeDoc)
    getRecipeList()
  }

  const handleShowAdd = (recipe) => {
    setShowAdd(true)
    setSelectedRecipe(recipe)
  }

  const paginate = (pageNumber, e) => {
    e.preventDefault()
    setCurrentPage(pageNumber)
  }

  return (
    <section className="myrecipes-section">
      <h1>My recipes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {currentResults.length === 0 ? (
            <p>No Saved Recipes.</p>
          ) : (
            <div className="container">
              {currentResults.map((recipe) => {
                return (
                  <div key={recipe.id} className="ui-card-myrecipes">
                    <h1>{recipe.name}</h1>
                    <img src={recipe.image} alt="" />
                    <p>{recipe.createdAt.toDate().toLocaleDateString()}</p>
                    <p>{recipe.createdAt.toDate().toLocaleTimeString()}</p>
                    <button onClick={() => deleteRecipe(recipe.id)}>
                      Delete Recipe
                    </button>
                    <button onClick={() => handleShowAdd(recipe)}>
                      Add to a meal plan
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
      <AddToMealplanPopUp
        selectedRecipe={selectedRecipe}
        user={user}
        showAdd={showAdd}
        setShowAdd={setShowAdd}
      />
      <Pagination
        resultsPerPage={resultsPerPage}
        totalResults={recipeList.length}
        paginate={paginate}
      ></Pagination>
    </section>
  )
}
