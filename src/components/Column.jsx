import { Droppable } from 'react-beautiful-dnd'
import RecipeOnMealPlan from './RecipeOnMealPlan'
export default function Column({ column, recipes, handleRemove }) {
  return (
    <div className="day-wrapper">
      <Droppable droppableId={column.day} key={column.day}>
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
              }}
              className="draggable-area"
            >
              {recipes.map((recipe, index) => {
                return (
                  <RecipeOnMealPlan
                    key={recipe.id}
                    recipe={recipe}
                    index={index}
                    handleRemove={handleRemove}
                    column={column}
                  />
                )
              })}
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </div>
  )
}
