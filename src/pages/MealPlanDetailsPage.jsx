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
console.log('columns from backend', columnsFromBackend)
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
  const [mealPlan, setMealPlan] = useState({})
  const [recipes, setRecipes] = useState({})
  const getMealPlan = async () => {
    try {
      const q = query(mealPlansRef, where('__name__', '==', id))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        console.log('doc.data() or mealPlan', doc.data())
        setMealPlan(doc.data())
        console.log(doc.data().columns)
        // setColumns(doc.data().columns)
        // setRecipes(doc.data().recipes)

        // Object.values(doc.data().recipes).forEach((recipe) => {
        //   recipeDatabase[recipe.edamam_id] = recipe.name
        //   console.log('recipe', recipe)
        // })
        // console.log('recipeDatabase', recipeDatabase)
        // for (const [key, value] of Object.entries(doc.data().columns)) {
        //   const recipes = []
        //   value.recipe_ids.forEach((recipe) =>
        //     recipes.push({
        //       id: recipe,
        //       content: recipeDatabase[recipe],
        //     }),
        //   )
        // columnsFromBackend[key] = { name: key, items: recipes }
        // }
      })
      // setColumns(columnsFromBackend)
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
      // setColumns({
      //   ...columns,
      //   [source.droppableId]: { ...sourceColumn, items: sourceItems },
      //   [destination.droppableId]: { ...destColumn, items: destItems },
      // })
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
                              key={recipe.id}
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
