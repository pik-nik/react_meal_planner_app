import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../index'
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import '../css/RecipeDetailsPage.css'

export default function RecipeDetailsPage() {
  const [recipe, setRecipe] = useState(null)
  const { id } = useParams()
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [show, setShow] = useState(false)
  const [selectedPlanner, setSelectedPlanner] = useState('default')
  const [mealPlans, setMealPlans] = useState(null)
  const [recipeList, setRecipeList] = useState([])
  const [newPlanner, setNewPlanner] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState({})

  const handleClose = () => {
    setShowAdd(false)
    setSelectedPlanner('default')
    setNewPlanner('')
  }
  const handleAddRec = async () => {
    setShow(true)
    try {
      await addDoc(recipeCollectionsRef, {
        name: recipe.label,
        edamam_id: id,
        image: recipe.image,
        user_id: 1, // hardcoded user id for now
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      console.log(err)
    }
    // setRecipeAdded(true)
  }
  const recipeCollectionsRef = collection(db, 'recipes')
  const mealPlansRef = collection(db, 'mealplans')
  const getRecipeList = async () => {
    const q = query(
      recipeCollectionsRef,
      //if user anth is done, uncomment the next line
      // where('user_id', '==', '1'),
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

  const getMealPlans = async () => {
    try {
      const data = await getDocs(mealPlansRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setMealPlans(filteredData)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getRecipeList()
    getMealPlans()
  }, [])

  const handleChangeExisting = (e) => {
    setSelectedPlanner(e.target.value)
    setNewPlanner('')
  }

  const handleChangeNew = (e) => {
    setNewPlanner(e.target.value)
    setSelectedPlanner('default')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShow(false)
    if (selectedPlanner !== 'default') {
      const mealPlansDoc = doc(db, 'mealplans', selectedPlanner)
      const tempState = mealPlans.filter(
        (mealPlan) => mealPlan.id === selectedPlanner,
      )[0]
      tempState.columns['Monday'].recipe_ids.push(selectedRecipe.edamam_id)
      tempState.recipes = {
        ...tempState.recipes,
        [selectedRecipe.edamam_id]: selectedRecipe,
      }
      await updateDoc(mealPlansDoc, tempState)
      setSelectedPlanner('default')
      setNewPlanner('')
    } else {
      try {
        await addDoc(mealPlansRef, {
          name: newPlanner,
          column_order: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          columns: {
            Monday: {
              id: uuid(),
              day: 'Monday',
              recipe_ids: [selectedRecipe.edamam_id],
            },
            Tuesday: { id: uuid(), day: 'Tuesday', recipe_ids: [] },
            Wednesday: { id: uuid(), day: 'Wednesday', recipe_ids: [] },
            Thursday: { id: uuid(), day: 'Thursday', recipe_ids: [] },
            Friday: { id: uuid(), day: 'Friday', recipe_ids: [] },
            Saturday: { id: uuid(), day: 'Saturday', recipe_ids: [] },
            Sunday: { id: uuid(), day: 'Sunday', recipe_ids: [] },
          },
          recipes: {
            [selectedRecipe.edamam_id]: selectedRecipe,
          },
          user: 1, // use userid or username
          created_at: serverTimestamp(),
        })
        getMealPlans()
        setSelectedPlanner('default')
        setNewPlanner('')
      } catch (err) {
        console.log(err)
      }
    }
  }
  // const { recipe } = results.find((recipe) => {
  // const uri = recipe.recipe.uri
  // const idFsetSelectedIndexromResults = uri.substring(uri.indexOf('_') + 1, uri.length)
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
              setShow(true)
              setSelectedRecipe(recipe)
            }}
            disabled={recipeAdded}
            className="add-btn"
          >
            <AiOutlineHeart /> Add to My Recipes
          </Button>
          {recipeAdded ? (
            <>
              <Link to="/my-recipes">
                <span>
                  <AiFillHeart /> ADDED Go to My Recipes
                </span>
              </Link>
            </>
          ) : null}
          <p>
            Original Source: <Link to={recipe?.url}>{recipe?.source}</Link>
          </p>
          <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>
                Which meal planner do you want to add{' '}
                <i>{selectedRecipe.name}</i> to?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Text>Save into existing meal plan</Form.Text>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={handleChangeExisting}
                    value={selectedPlanner}
                  >
                    <option value="default">Pick meal plan</option>
                    {mealPlans?.map((mealPlan, index) => (
                      <option key={index} value={mealPlan.id}>
                        {mealPlan.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text>Save into new meal plan</Form.Text>
                  <Form.Control
                    onChange={handleChangeNew}
                    type="text"
                    placeholder="Enter new meal plan name"
                    value={newPlanner}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={(e) => handleSubmit(e)}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </main>
    </section>
  )
}
