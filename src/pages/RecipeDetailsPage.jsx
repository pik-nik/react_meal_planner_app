import { useParams } from 'react-router'
export default function RecipeDetailsPage({ results }) {
  const { recipeName } = useParams()
  const { recipe } = results.find((recipe) => {
    return recipe.recipe.label === recipeName
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
