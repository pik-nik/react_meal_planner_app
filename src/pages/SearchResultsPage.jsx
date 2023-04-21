import { Link } from 'react-router-dom'

export default function SearchResultsPage({ results }) {
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
