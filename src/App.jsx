import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '.'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MyRecipesPage from './pages/MyRecipesPage'
import MealPlanDetailsPage from './pages/MealPlanDetailsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import RecipeDetailsPage from './pages/RecipeDetailsPage'
import NavBar from './components/NavBar'
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import MyMealPlans from './pages/MyMealPlans'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user)
    })
  }, [])

  return (
    <div className="App">
      <NavBar user={user} onLogout={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search/:keyword" element={<SearchResultsPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        <Route path="/my-recipes" element={<MyRecipesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/my-meal-plans" element={<MyMealPlans />} />
        <Route path="/my-meal-plans/:id" element={<MealPlanDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App
