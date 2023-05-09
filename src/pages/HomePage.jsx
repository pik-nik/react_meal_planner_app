import SearchBarSection from '../components/SearchBarSection'
import PopularSearches from '../components/PopularSearches'
import RandomMeal from '../components/RandomMeal'
import '../css/HomePage.css'

export default function HomePage() {
  return (
    <main className="main-home">
      <SearchBarSection />
      <section className="categories">
        <PopularSearches />
        <RandomMeal />
      </section>
    </main>
  )
}
