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
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Form } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
export default function MyRecipesPage() {
  const [recipeList, setRecipeList] = useState([])
  const [mealPlans, setMealPlans] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedPlanner, setSelectedPlanner] = useState('default')
  const [newPlanner, setNewPlanner] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState({})
  // Read the data from db
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

  const deleteRecipe = async (id) => {
    const recipeDoc = doc(db, 'recipes', id)
    await deleteDoc(recipeDoc)
    getRecipeList()
  }

  const handleHideAdd = () => {
    setShowAdd(false)
    setSelectedPlanner('default')
    setNewPlanner('')
  }

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
    setShowAdd(false)
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
      // console.log(tempState)
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
    </section>
  )
}
