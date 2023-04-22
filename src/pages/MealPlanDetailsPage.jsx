export default function MealPlanPage() {
  return (
    <section>
      <h1>Meal Plan</h1>
      <div className="column-container">
        {/* this will eventually be mapped but to visualise */}
        <div className="column saved-recipes"></div>
        <div className="column Monday"></div>
        <div className="column Tuesday"></div>
        <div className="column Wednesday"></div>
        <div className="column Thursday"></div>
        <div className="column Friday"></div>
        <div className="column Saturday"></div>
        <div className="column Sunday"></div>
      </div>
    </section>
  )
}
