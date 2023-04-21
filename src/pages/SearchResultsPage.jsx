import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

export default function SearchResultsPage({ results }) {
  // const handleClick = () => {

  // }
  return (
    <section>
      <ul>
        {results.map((result, index) => {
          return (
            <li key={index}>
              <Link
                to={`/recipes/${result.recipe.label}`}
                // onClick={handleClick(result.recipe.label)}
              >
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
