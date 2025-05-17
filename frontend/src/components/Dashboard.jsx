import { useState } from "react";
export function Dashboard() {
  const [loading, setLoading] = useState(false);
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1>Dashboard</h1>
    </div>
  );
}
