import React, { useState } from 'react'
import '../App.css'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '..'

const Todo = () => {
  const [todo, setTodo] = useState('')

  const addTodo = async (e) => {
    e.preventDefault()

    const docRef = await addDoc(collection(db, 'todos'), {
      todo: todo,
    })
    console.log('testing', docRef.id)
  }

  const handleChange = (e) => setTodo(e.target.value)

  return (
    <section className="todo-container">
      <div className="todo">
        <h1 className="header">Todo-App</h1>

        <div>
          <div>
            <input
              type="text"
              placeholder="What do you have to do today?"
              value={todo}
              onChange={handleChange}
            />
          </div>

          <div className="btn-container">
            <button type="submit" className="btn" onClick={addTodo}>
              Submit
            </button>
          </div>
        </div>

        <div className="todo-content">...</div>
      </div>
    </section>
  )
}

export default Todo
