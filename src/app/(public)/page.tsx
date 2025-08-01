import Login from "../_components/login";

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Login />
      </div>
    </div>
  );
}
