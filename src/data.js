import { v4 as uuid } from 'uuid'

// This is data for the meal planner board
const recipesFromBackend = [
  { id: uuid(), name: 'recipe 1', recipe: {} },
  { id: uuid(), name: 'recipe 2', recipe: {} },
  { id: uuid(), name: 'recipe 3', recipe: {} },
  { id: uuid(), name: 'recipe 4', recipe: {} },
]
export const columnsFromBackend = [
  { id: uuid(), name: 'Selected Recipes', recipes: recipesFromBackend },
  { id: uuid(), name: 'Monday', recipes: [] },
  { id: uuid(), name: 'Tuesday', recipes: [] },
  { id: uuid(), name: 'Wednesday', recipes: [] },
  { id: uuid(), name: 'Thursday', recipes: [] },
  { id: uuid(), name: 'Friday', recipes: [] },
  { id: uuid(), name: 'Saturday', recipes: [] },
  { id: uuid(), name: 'Sunday', recipes: [] },
]
