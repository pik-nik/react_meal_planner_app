import { db } from '../index'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { v4 as uuid } from 'uuid'
import '../css/MealPlanDetailsPage.css'

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return
  const { source, destination } = result
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      [destination.droppableId]: { ...destColumn, items: destItems },
    })
  } else {
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: { ...column, items: copiedItems },
    })
  }
}
var recipeDatabase = {}
var columnsFromBackend = {
  Monday: {},
  Tuesday: {},
  Wednesday: {},
  Thursday: {},
  Friday: {},
  Saturday: {},
  Sunday: {},
}
// const columnOrder = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
//   'Sunday',
// ]
export default function MealPlanPage() {
  const mealPlansRef = collection(db, 'mealplans')
  const { id } = useParams()
  const [columns, setColumns] = useState({})

  const getMealPlan = async () => {
    try {
      const q = query(mealPlansRef, where('__name__', '==', id))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        Object.values(doc.data().recipes).forEach(
          (recipe) => (recipeDatabase[recipe.edamam_id] = recipe.name),
        )
        for (const [key, value] of Object.entries(doc.data().columns)) {
          const recipes = []
          value.recipe_ids.forEach((recipe) =>
            recipes.push({
              id: recipe,
              content: recipeDatabase[recipe],
            }),
          )
          columnsFromBackend[key] = { name: key, items: recipes }
        }
      })
      setColumns(columnsFromBackend)
    } catch (err) {
      console.log(err)
    }
  }

  // const removeRecipe = (index, day) => {
  //   const newColumns = {
  //     ...columns,
  //     [columns[day]]: columns[day].items.filter((_, i) => i !== index),
  //   }
  //   setColumns(newColumns)
  // }

  useEffect(() => {
    getMealPlan()
  }, [])

  return (
    <div className="DND">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns)?.map(([id, column]) => {
          return (
            <div className="column" key={id}>
              <h2>{column.name}</h2>
              <div className="item-wrapper">
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? 'lightblue'
                            : 'lightgrey',
                        }}
                        className="draggable-area"
                      >
                        {column.items?.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    className="item"
                                    style={{
                                      backgroundColor: snapshot.isDragging
                                        ? '#263B4A'
                                        : '#456C86',
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.content}
                                    {/* <button
                                      onClick={() =>
                                        removeRecipe(index, column.name)
                                      }
                                      className="hide-btn"
                                    >
                                      X
                                    </button> */}
                                  </div>
                                )
                              }}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
              </div>
            </div>
          )
        })}
      </DragDropContext>
    </div>
    // <section className="DND">
    //   <h1>Meal Plan</h1>
    //   <div className="column-container">
    //     {mealPlan.column_order?.map((day) => {
    //       const column = mealPlan.columns[day]
    //       const recipes = column.recipe_ids.map((id) => mealPlan.recipes[id])
    //       return (
    //         <div key={day} className="column-title">
    //           <h2>{day}</h2>
    //           <div className="recipe-list">
    //             {recipes.map((recipe, index) => {
    //               return <div key={recipe.id}>{recipe.name}</div>
    //             })}
    //           </div>
    //         </div>
    //       )
    //     })}
    //   </div>
    // </section>
  )
}
