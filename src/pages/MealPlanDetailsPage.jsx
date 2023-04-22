import { db } from '../index'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export default function MealPlanPage() {
  const mealPlansRef = collection(db, 'mealplans')
  const { id } = useParams()
  const [mealPlan, setMealPlan] = useState({})

  const getMealPlan = async () => {
    try {
      const q = query(mealPlansRef, where('__name__', '==', id))
      const querySnapshot = await getDocs(q)
      const data = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id })
      })
      // console.log(data[0])
      setMealPlan(data[0]) // sets meal plan to the meal plan which is given in object
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMealPlan()
  }, [])

  return (
    <section>
      <h1>Meal Plan</h1>
      <div className="column-container">
        {mealPlan.column_order?.map((day) => {
          const column = mealPlan.columns[day]
          const recipes = column.recipe_ids.map((id) => mealPlan.recipes[id])
          return (
            <div key={day} className="column-title">
              <h2>{day}</h2>
              <div className="recipe-list">
                {recipes.map((recipe, index) => {
                  return <div key={recipe.id}>{recipe.name}</div>
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
