import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { db } from '../index'
import {
  addDoc,
  getDocs,
  collection,
  serverTimestamp,
} from 'firebase/firestore'
import Pagination from '../components/Pagination'
import '../css/SearchResultsPage.css'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

export default function SearchResultsPage() {
  const [results, setResults] = useState([])
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [diplayResults, setDisplayResults] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [show, setShow] = useState(false)
  const [mealPlans, setMealPlans] = useState(null)
  const [newMealPlan, setNewMealPlan] = useState(null)
  const [params] = useSearchParams()

  useEffect(() => {
    setLoading(true)
    const queryString = [...params].reduce((query, [key, value]) => {
      return query + `&${key}=${value}`
    }, '')
    fetch(
      `https://api.edamam.com/search?app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}${queryString}&from=0&to=100`,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.hits)
        setLoading(false)
      })
  }, [params])

  const recipeCollectionsRef = collection(db, 'recipes')

  const handleClose = () => setShow(false)
  const handleAddRec = async (id, { recipe }, index) => {
    setShow(true)
    setSelectedIndex(index)
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

  const handleAddtoMealPlan = () => {} // function to add the recipe to the meal plan
  const handleAddNewMealPlan = async (e, edamamId, { recipe }) => {
    e.preventDefault()
    setShow(false)
    try {
      await addDoc(mealPlansRef, {
        name: newMealPlan,
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
          Monday: { id: uuid(), day: 'Monday', recipe_ids: [edamamId] },
          Tuesday: { id: uuid(), day: 'Tuesday', recipe_ids: [] },
          Wednesday: { id: uuid(), day: 'Wednesday', recipe_ids: [] },
          Thursday: { id: uuid(), day: 'Thursday', recipe_ids: [] },
          Friday: { id: uuid(), day: 'Friday', recipe_ids: [] },
          Saturday: { id: uuid(), day: 'Saturday', recipe_ids: [] },
          Sunday: { id: uuid(), day: 'Sunday', recipe_ids: [] },
        },
        recipes: {
          [edamamId]: recipe,
        },
        user: 1, // use userid or username
        created_at: serverTimestamp(),
      })
      getMealPlans()
    } catch (err) {
      console.log(err)
    }
  } // function to add the new meal plan and the recipe to the database }

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
      {loading ? (
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
                        {/* {console.log(result.recipe.dietLabels)} */}
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
                      <Modal show={show} onHide={handleClose} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Save recipe</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{result.recipe.label} recipe</Modal.Body>
                        <Form.Select
                          aria-label="Default select example"
                          onChange={handleAddtoMealPlan}
                        >
                          <option>Save into your meal plan</option>
                          {mealPlans.map((mealPlan, index) => (
                            <option key={index} value={mealPlan.name}>
                              {mealPlan.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text>Or, you can make a new meal plan</Form.Text>
                        <Form.Control
                          type="text"
                          placeholder="new plan name"
                          onChange={(e) => handleAddNewMealPlan(e, id, result)} // on here, the Modal closes when we put one letter in as that is the first change, we might need to move this out and do an on submit?
                        />
                        <Modal.Footer>
                          <Button variant="primary" onClick={handleClose}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                  )
                })}
              </ul>
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
