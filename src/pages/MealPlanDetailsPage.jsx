import { db } from '../index'
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import '../css/MealPlanDetailsPage.css'
import { v4 as uuid } from 'uuid'

export default function MealPlanPage() {
  const mealPlansRef = collection(db, 'mealplans')
  const { id } = useParams()
  const [mealPlan, setMealPlan] = useState({})
  const getMealPlan = async () => {
    try {
      const q = query(mealPlansRef, where('__name__', '==', id))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        console.log('doc.data() or mealPlan', doc.data())
        setMealPlan(doc.data())
      })
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

  // IN PROGRESS
  // const handleRemove = (recipe, index, day) => {
  //   // this is an update not delete from db call- need to update to remove from array and from recipes object
  //   const mealPlansDoc = doc(db, 'mealplans', mealPlan.id)
  //   const newMealPlan = { ...mealPlan }
  //   const columnToDeleteFrom = mealPlan.columns[day]
  //   const recipeIds = [...columnToDeleteFrom.recipe_ids]
  //   recipeIds.splice(index, 1)
  //   newMealPlan.columns[day].recipe_ids = recipeIds
  // }

  useEffect(() => {
    getMealPlan()
  }, [])

  const onDragEnd = async (result, columns) => {
    console.log(columns)
    if (!result.destination) return
    const { source, destination } = result
    const mealPlansDoc = doc(db, 'mealplans', mealPlan.id)
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.recipe_ids]
      const destItems = [...destColumn.recipe_ids]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      const newMealPlan = { ...mealPlan }
      newMealPlan.columns[source.droppableId].recipe_ids = sourceItems
      newMealPlan.columns[destination.droppableId].recipe_ids = destItems
      setMealPlan(newMealPlan)
      await updateDoc(mealPlansDoc, newMealPlan)
    } else {
      const column = columns[source.droppableId]
      const copiedRecipeIds = [...column.recipe_ids]
      const [removed] = copiedRecipeIds.splice(source.index, 1)
      copiedRecipeIds.splice(destination.index, 0, removed)
      const newMealPlan = { ...mealPlan }
      newMealPlan.columns[source.droppableId].recipe_ids = copiedRecipeIds
      setMealPlan(newMealPlan)
      await updateDoc(mealPlansDoc, newMealPlan)
    }
  }
  return (
    <div className="DND">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, mealPlan.columns)}
      >
        {mealPlan.column_order?.map((day) => {
          const column = mealPlan.columns[day]
          const recipes = column.recipe_ids.map((id) => mealPlan.recipes[id]) // can possible change this to put order in this code instead of on db
          return (
            <div className="column" key={column.id}>
              <h2>{day}</h2>
              <div className="item-wrapper">
                <Droppable droppableId={column.day} key={column.day}>
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
                        {recipes.map((recipe, index) => {
                          return (
                            <Draggable
                              key={uuid()}
                              draggableId={recipe.id}
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
                                    {recipe.name}
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
  )
}
