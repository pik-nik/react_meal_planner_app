export default function SearchResultsPage({ results }) {
  return (
    <section>
      <ul>
        {results.map((result, index) => {
          return <li key={index}>{result.recipe.label}</li>
        })}
      </ul>
    </section>
  )
}
