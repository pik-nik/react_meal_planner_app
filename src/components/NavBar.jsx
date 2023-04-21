export default function NavBar({ user }) {
  return (
    <header>
      <nav>
        <ul>
          <li>Nav</li>
        </ul>
      </nav>
      {user && <span>hello {user.email}</span>}
    </header>
  )
}
