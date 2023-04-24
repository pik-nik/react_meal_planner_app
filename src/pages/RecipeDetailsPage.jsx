import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../index'
import { getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import '../css/RecipeDetailsPage.css'
import AddToMealplanPopUp from '../components/AddToMealplanPopUp'

export default function RecipeDetailsPage({ user, loading }) {
  const [recipe, setRecipe] = useState(null)
  const { id } = useParams()
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState({})

  const handleAddRec = async () => {
    try {
      const docReference = await addDoc(recipeCollectionsRef, {
        name: recipe.label,
        edamam_id: id,
        image: recipe.image,
        user_id: user.uid,
        createdAt: serverTimestamp(),
      })
      const returnedRecipe = await getDoc(docReference)
      setSelectedRecipe({
        ...returnedRecipe.data(),
        id: returnedRecipe.id,
      })
    } catch (err) {
      console.log(err)
    }
    setRecipeAdded(true)
  }
  const recipeCollectionsRef = collection(db, 'recipes')

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
    <section className="details-section">
      <main className="details-content">
        <div className="img-container">
          <img src={recipe?.image} alt="" />
        </div>
        <div className="content-container">
          <h1>{recipe?.label}</h1>
          <ul>
            Ingredients:
            {recipe?.ingredientLines.map((ingredient, index) => {
              return <li key={index}>{ingredient}</li>
            })}
          </ul>
          <p>
            Health labels:
            {recipe?.healthLabels
              .filter((label, index) => index < 6)
              .map((label, index) => {
                return <span key={index}> {label} </span>
              })}
          </p>
          {recipe?.totalTime > 0 ? (
            <p>Make in {recipe?.totalTime} mins</p>
          ) : null}
          <Button
            variant="primary"
            onClick={() => {
              handleAddRec()
            }}
            disabled={recipeAdded}
            className="add-btn"
          >
            <AiOutlineHeart /> Add to My Recipes
          </Button>
          {recipeAdded && (
            <>
              <Link to="/my-recipes">
                <span>
                  <AiFillHeart /> ADDED Go to My Recipes
                </span>
              </Link>
            </>
          )}
          {recipeAdded && (
            <Button onClick={() => setShowAdd(true)}>Add to meal plan</Button>
          )}
          <p>
            Original Source: <Link to={recipe?.url}>{recipe?.source}</Link>
          </p>
          <AddToMealplanPopUp
            selectedRecipe={selectedRecipe}
            user={user}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
          />
        </div>
      </main>
    </section>
  )
}
