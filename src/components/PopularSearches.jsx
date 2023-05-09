import { Link } from 'react-router-dom'
import { popularSearches } from '../data'

export default function PopularSearches() {
  return (
    <div className="popular">
      <h1>Popular Searches</h1>
      <div className="popular-searches">
        {popularSearches.map((search, index) => (
          <div key={index} className="popular-search">
            <Link to={`/search?q=${search.name}`}>
              <img src={search.image} alt={search.name} />
              <h4>{search.name}</h4>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
