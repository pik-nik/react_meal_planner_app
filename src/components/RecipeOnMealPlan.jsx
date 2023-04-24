import { Draggable } from 'react-beautiful-dnd'
import '../css/RecipeOnMealPlan.css'
import { Link } from 'react-router-dom'
export default function RecipeOnMealPlan({
  recipe,
  index,
  handleRemove,
  column,
}) {
  return (
    <Draggable key={recipe.id} draggableId={recipe.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            style={{
              backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
              ...provided.draggableProps.style,
              borderRadius: 7,
              padding: 3,
            }}
            className="recipe item"
          >
            <div className="item-content">
              <img src={recipe.image} className="recipe-image" alt="" />
              <Link to={`/recipes/${recipe.edamam_id}`}>
                <p className="recipe-name">{recipe.name}</p>
              </Link>
              <button
                onClick={() =>
                  handleRemove(index, column.day, recipe.edamam_id)
                }
                className="hide-btn"
              >
                X
              </button>
            </div>
          </div>
        )
      }}
    </Draggable>
  )
}
