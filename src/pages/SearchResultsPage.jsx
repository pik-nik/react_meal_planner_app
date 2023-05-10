import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { db } from '../index'
import { addDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore'
import Pagination from '../components/Pagination'
import '../css/SearchResultsPage.css'
import Button from 'react-bootstrap/Button'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import AddToMealplanPopUp from '../components/AddToMealplanPopUp'

export default function SearchResultsPage({ user, loading }) {
  const [results, setResults] = useState([])
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingResults, setLoadingResults] = useState(true)
  const [diplayResults, setDisplayResults] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const resultsPerPage = 12

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

  const recipeCollectionsRef = collection(db, 'recipes')
  const handleAddRec = async (id, { recipe }, index) => {
    if (!user) navigate('/login')
    setSelectedIndex(index)
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

  return (
    <section className="results-section">
      <header>
        <h1>Search Results :</h1>
        <div>
          <button className="list" onClick={handleDisplay}>
            {diplayResults ? 'Display as Tiles' : 'Display as List'}
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
                            {result.recipe.dietLabels &&
                              result.recipe.dietLabels.length > 0 && (
                                <span>
                                  Diet labels:{' '}
                                  {result.recipe.dietLabels.join(' ')}
                                </span>
                              )}

                            <span>
                              {' '}
                              Health Labels:{' '}
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
                          {recipeAdded && selectedIndex === index && (
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
                          )}
                          {recipeAdded && selectedIndex === index && (
                            <Button onClick={() => setShowAdd(true)}>
                              Add to meal plan
                            </Button>
                          )}
                        </div>
                      </li>
                    </>
                  )
                })}
              </ul>
              <AddToMealplanPopUp
                selectedRecipe={selectedRecipe}
                user={user}
                showAdd={showAdd}
                setShowAdd={setShowAdd}
              />
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
