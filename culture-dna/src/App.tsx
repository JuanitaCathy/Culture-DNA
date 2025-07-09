import React from "react";
import { SearchQloo } from "./components/SearchQloo";

function App() {
  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Qloo Hackathon API Tester</h1>
      <SearchQloo />
    </div>
  );
}

export default App;
