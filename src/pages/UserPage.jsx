export default function UserPage({ user, onLoad }) {
  return (
    <section>
      {onLoad ? <p>Loading...</p> : <h2>{user.displayName}</h2>}
    </section>
  )
}
