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
      console.log(data[0])
      setMealPlan(data[0])
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
        {mealPlan.columnOrder?.map((day) => {
          const column = mealPlan.columns[day] // change datastructure of columns

          console.log(column) // undefined
          return <div key={day}>{day}</div>
        })}
      </div>
    </section>
  )
}
