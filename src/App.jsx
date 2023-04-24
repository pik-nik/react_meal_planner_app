import { Routes, Route } from 'react-router-dom'
import { auth } from '.'
import { useAuthState } from 'react-firebase-hooks/auth'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import UserPage from './pages/UserPage'
import MyRecipesPage from './pages/MyRecipesPage'
import MyMealPlans from './pages/MyMealPlans'
import MealPlanDetailsPage from './pages/MealPlanDetailsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import RecipeDetailsPage from './pages/RecipeDetailsPage'
import NavBar from './components/NavBar'
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [user, loading, error] = useAuthState(auth)

  return (
    <div className="App">
      <NavBar user={user} loading={loading} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/search"
          element={<SearchResultsPage user={user} loading={loading} />}
        />
        <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        <Route
          path="/user/:uid"
          element={<UserPage user={user} loading={loading} />}
        />
        <Route
          path="/my-recipes"
          element={<MyRecipesPage user={user} loading={loading} />}
        />
        <Route
          path="/my-meal-plans"
          element={<MyMealPlans user={user} loading={loading} />}
        />
        <Route
          path="/my-meal-plans/:id"
          element={<MealPlanDetailsPage user={user} loading={loading} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  )
}

export default App
