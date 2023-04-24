import { Draggable } from 'react-beautiful-dnd'

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
            className="item"
            style={{
              backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
              ...provided.draggableProps.style,
            }}
          >
            {recipe.name}
            <button
              onClick={() => handleRemove(index, column.day, recipe.edamam_id)}
              // className="hide-btn"
            >
              X
            </button>
          </div>
        )
      }}
    </Draggable>
  )
}
