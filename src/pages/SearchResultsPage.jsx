import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../index'
import { addDoc, collection } from 'firebase/firestore'
import Pagination from '../components/Pagination'
import '../css/SearchResultsPage.css'
export default function SearchResultsPage() {
  const [results, setResults] = useState([])
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [diplayResults, setDisplayResults] = useState(true)

  const { keyword } = useParams()
  useEffect(() => {
    setLoading(true)
    fetch(
      `https://api.edamam.com/search?q=${keyword}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}&from=0&to=100`,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.hits)
        setLoading(false)
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
        <h1>Search Results</h1>
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
          <ul className={diplayResults ? 'display-list' : 'display-title'}>
            {currentResults.map((result, index) => {
              const uri = result.recipe.uri
              const id = uri.substring(uri.indexOf('_') + 1, uri.length)
              return (
                <li key={index}>
                  <Link to={`/recipes/${id}`}>
                    <div>
                      <img src={result.recipe.image} alt="" />
                    </div>
                    <footer>
                      <h2>{result.recipe.label}</h2>
                      <span>{result.recipe.dietLabels}</span>
                      <span>Made in {result.recipe.totalTime} mins</span>
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
        </>
      )}

      <Pagination
        resultsPerPage={resultsPerPage}
        totalResults={results.length}
        paginate={paginate}
      />
    </section>
  )
}
