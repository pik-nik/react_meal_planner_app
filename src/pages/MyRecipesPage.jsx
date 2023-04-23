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
  updateDoc,
} from 'firebase/firestore'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Form } from 'react-bootstrap'
export default function MyRecipesPage() {
  const getRecipeList = async () => {
    // Read the data from db
    const recipeCollectionsRef = collection(db, 'recipes')
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
  const [recipeList, setRecipeList] = useState([])
  useEffect(() => {
    getRecipeList()
  }, [])

  const deleteRecipe = async (id) => {
    const recipeDoc = doc(db, 'recipes', id)
    await deleteDoc(recipeDoc)
    getRecipeList()
  }
  const [showAdd, setShowAdd] = useState(false)
  const [selectedPlanner, setSelectedPlanner] = useState('')
  const [mealPlans, setMealPlans] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState({})
  const mealPlansRef = collection(db, 'mealplans')
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
    getMealPlans()
  }, [])

  console.log(mealPlans)

  const handleHideAdd = () => {
    setShowAdd(false)
    setSelectedPlanner('')
  }

  const handleSubmitToExisting = async (e) => {
    e.preventDefault()
    const mealPlansDoc = doc(db, 'mealplans', selectedPlanner)
    // console.log(mealPlans)
    const tempState = mealPlans.filter(
      (mealPlan) => mealPlan.id === selectedPlanner,
    )[0]
    tempState.columns['Monday'].recipe_ids.push(selectedRecipe.edamam_id)
    tempState.recipes = {
      ...tempState.recipes,
      [selectedRecipe.edamam_id]: selectedRecipe,
    }
    console.log(tempState)
    await updateDoc(mealPlansDoc, tempState)
  }
  console.log(selectedPlanner)
  //   e.preventDefault()
  //   setShowAdd(false)
  //   try {
  //     await addDoc(mealPlansRef, {
  //       name: selectedPlanner,
  //       column_order: [
  //         'Monday',
  //         'Tuesday',
  //         'Wednesday',
  //         'Thursday',
  //         'Friday',
  //         'Saturday',
  //         'Sunday',
  //       ],
  //       columns: {
  //         Monday: { id: uuid(), day: 'Monday', recipe_ids: [] },
  //         Tuesday: { id: uuid(), day: 'Tuesday', recipe_ids: [] },
  //         Wednesday: { id: uuid(), day: 'Wednesday', recipe_ids: [] },
  //         Thursday: { id: uuid(), day: 'Thursday', recipe_ids: [] },
  //         Friday: { id: uuid(), day: 'Friday', recipe_ids: [] },
  //         Saturday: { id: uuid(), day: 'Saturday', recipe_ids: [] },
  //         Sunday: { id: uuid(), day: 'Sunday', recipe_ids: [] },
  //       },
  //       recipes: {}, // contains id: {id: ... name: ... } maybe whole thing from my recipes?
  //       user: 1, // use userid or username
  //     })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  return (
    <section>
      <h1>My recipes</h1>
      <div>
        {recipeList.map((recipe) => {
          return (
            <div key={recipe.id}>
              <h1>{recipe.name}</h1>
              <img src={recipe.image} alt="" />
              <p>{recipe.createdAt.toDate().toLocaleDateString()}</p>
              <p>{recipe.createdAt.toDate().toLocaleTimeString()}</p>
              <button onClick={() => deleteRecipe(recipe.id)}>
                Delete Recipe
              </button>
              <button
                onClick={() => {
                  setShowAdd(true)
                  setSelectedRecipe(recipe)
                }}
              >
                Add to a meal plan
              </button>
            </div>
          )
        })}
      </div>
      <Modal show={showAdd} onHide={handleHideAdd} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            Which meal planner do you want to add <i>{selectedRecipe.name}</i>{' '}
            to?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setSelectedPlanner(e.target.value)}
              >
                <option>Save into a meal plan</option>
                {mealPlans?.map((mealPlan, index) => (
                  <option key={index} value={mealPlan.id}>
                    {mealPlan.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control
                onChange={(e) => setSelectedPlanner(e.target.value)}
                type="text"
                placeholder="Enter New Meal Planner name"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={(e) => handleSubmitToExisting(e)}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  )
}
