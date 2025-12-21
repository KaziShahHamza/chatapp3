// client/src/pages/Profile.jsx
export default function Profile({ user }) {
  return (
    <div>
      <h2>Profile</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Later:
        - edit profile
        - change password
        - user reputation
      */}
    </div>
  );
}
