// client/src/pages/Dashboard.jsx
export default function Dashboard({ user }) {
  return (
    <div>
      <h2>Dashboard</h2>

      <p>Welcome back, <strong>{user.name}</strong></p>

      <ul>
        <li>My Posts</li>
        <li>My Comments</li>
        <li>My Requests</li>
        <li>Saved Items</li>
      </ul>

      {/* Later:
        - fetch user posts
        - stats
        - notifications
      */}
    </div>
  );
}
