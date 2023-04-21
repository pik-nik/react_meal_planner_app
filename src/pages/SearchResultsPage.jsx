import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function SearchResultsPage() {
  const [results, setResults] = useState([])
  const { keyword } = useParams()
  useEffect(() => {
    fetch(
      `https://api.edamam.com/search?q=${keyword}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}&from=0&to=20`,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.hits)
      })
  }, [keyword])
  return (
    <section>
      <ul>
        {results.map((result, index) => {
          const uri = result.recipe.uri
          const id = uri.substring(uri.indexOf('_') + 1, uri.length)
          return (
            <li key={index}>
              <Link to={`/recipes/${id}`}>
                <h2>{result.recipe.label}</h2>
                <img src={result.recipe.image} alt="" />
                <footer>
                  <span>{result.recipe.dietLabels}</span>
                  <span>{result.recipe.totalTime}</span>
                </footer>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
