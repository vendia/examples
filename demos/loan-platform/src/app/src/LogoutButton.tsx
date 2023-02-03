export function LogoutButton() {
  return (
    <button
      type="button"
      className="btn btn-sm btn-outline"
      onClick={() => {
        console.log('logging out');
      }}
    >
      Log out
    </button>
  );
}
