import { useParams } from 'react-router'
export default function RecipeDetailsPage({ results }) {
  const { id } = useParams()
  const { recipe } = results.find((recipe) => {
    const uri = recipe.recipe.uri
    const idFromResults = uri.substring(uri.indexOf('_') + 1, uri.length)
    return idFromResults === id
  })
  return (
    <div>
      <h1>{recipe.label}</h1>
      <p>
        from {recipe.source}: {recipe.url}
      </p>
      <img src={recipe.image} alt="" />
      <ul>
        {recipe.ingredientLines.map((ingredient, index) => {
          return <li key={index}>{ingredient}</li>
        })}
      </ul>
    </div>
  )
}
