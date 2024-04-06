import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login.jsx";
import Game from "./Game.jsx";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if token exists in cookies/local storage
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
      <FlagsmithProvider
        options={{
          environmentID: import.meta.env.VITE_FLAGSMITH_KEY,
        }}
        flagsmith={flagsmith}
      >
        {isAuthenticated ? (
          <Game />
        ) : (
          <Login setIsAuthenticated={setIsAuthenticated} />
        )}
      </FlagsmithProvider>
  );
}

export default App;
