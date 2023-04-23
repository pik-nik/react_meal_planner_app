import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { db } from '../index'
import {
  addDoc,
  getDocs,
  doc,
  query,
  updateDoc,
  orderBy,
  collection,
  serverTimestamp,
} from 'firebase/firestore'
import Pagination from '../components/Pagination'
import '../css/SearchResultsPage.css'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { v4 as uuid } from 'uuid'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

export default function SearchResultsPage({ user, loading }) {
  const [results, setResults] = useState([])
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(10)
  const [loadingResults, setLoadingResults] = useState(true)
  const [diplayResults, setDisplayResults] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [show, setShow] = useState(false)
  const [mealPlans, setMealPlans] = useState(null)
  // const [newMealPlan, setNewMealPlan] = useState(null)
  const [selectedPlanner, setSelectedPlanner] = useState('default')
  const [newPlanner, setNewPlanner] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState({})
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    setLoadingResults(true)
    const queryString = [...params].reduce((query, [key, value]) => {
      return query + `&${key}=${value}`
    }, '')
    fetch(
      `https://api.edamam.com/search?app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}${queryString}&from=0&to=100`,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.hits)
        setLoadingResults(false)
      })
  }, [params])

  const handleClose = () => {
    setSelectedPlanner('default')
    setShow(false)
  }
  const handleAddRec = async (id, { recipe }, index) => {
    if (!user) navigate('/login')
    setShow(true)
    setSelectedIndex(index)
    try {
      await addDoc(recipeCollectionsRef, {
        name: recipe.label,
        edamam_id: id,
        image: recipe.image,
        user_id: user.uid, // hardcoded user id for now
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      console.log(err)
    }
    setRecipeAdded(true)
  }
  // get current displayed posts
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult)
  // change page
  const paginate = (pageNumber, event) => {
    event.preventDefault()
    setCurrentPage(pageNumber)
  }

  const handleDisplay = () => {
    setDisplayResults(!diplayResults)
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
      console.log(filteredData)
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
      // console.log(filteredData)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getMealPlans()
    getRecipeList()
  }, [])

  const handleChangeExisting = (e) => {
    console.log(e.target.value)
    setSelectedPlanner(e.target.value)
    setNewPlanner('')
  } // function to add the recipe to the meal plan

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
      // console.log(selectedRecipe, mealPlansDoc, tempState)
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
  // to add the new meal plan and the recipe to the database }

  return (
    <section className="results-section">
      <header>
        <h1>Search Results :</h1>
        <div>
          <button className="list" onClick={handleDisplay}>
            {diplayResults ? 'Title' : 'List'}
          </button>
        </div>
      </header>
      {loadingResults ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {results.length !== 0 ? (
            <>
              <ul className={diplayResults ? 'display-list' : 'display-title'}>
                {currentResults.map((result, index) => {
                  const uri = result.recipe.uri
                  const id = uri.substring(uri.indexOf('_') + 1, uri.length)
                  return (
                    <>
                      <li key={index}>
                        <Link to={`/recipes/${id}`}>
                          <div>
                            <img src={result.recipe.image} alt="" />
                          </div>
                          <footer>
                            <h2>{result.recipe.label}</h2>
                            <span>{result.recipe.dietLabels.join(' ')}</span>
                            <span>
                              {result.recipe.healthLabels
                                .splice(0, 3)
                                .join(', ')}
                            </span>
                            {result.recipe.totalTime > 0 ? (
                              <span>
                                Made in {result.recipe.totalTime} mins
                              </span>
                            ) : null}
                          </footer>
                        </Link>
                        <div>
                          <Button
                            variant="primary"
                            onClick={() => handleAddRec(id, result, index)}
                            disabled={recipeAdded && selectedIndex === index}
                            className="add-btn"
                          >
                            <AiOutlineHeart /> Add to My Recipes
                          </Button>
                          {recipeAdded && selectedIndex === index ? (
                            <>
                              <Link to="/my-recipes">
                                {
                                  <span className="message-added">
                                    <AiFillHeart />
                                    ADDED Go to My Recipes
                                  </span>
                                }
                              </Link>
                            </>
                          ) : null}
                        </div>
                      </li>
                    </>
                  )
                })}
              </ul>
              <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                  <Modal.Title>
                    Which meal planner do you want to add
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
                        type="text"
                        placeholder="new plan name"
                        onChange={handleChangeNew}
                        value={newPlanner} // on here, the Modal closes when we put one letter in as that is the first change, we might need to move this out and do an on submit?
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
              <Pagination
                resultsPerPage={resultsPerPage}
                totalResults={results.length}
                paginate={paginate}
              />
            </>
          ) : (
            <p>no results</p>
          )}
        </>
      )}
    </section>
  )
}
