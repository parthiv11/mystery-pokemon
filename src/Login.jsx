import React, { useState } from "react";
import "./Login.css";
import { useFlags } from 'flagsmith/react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flags = useFlags(['gemini_info']); 
  const gemini_info_enabled = flags.gemini_info.enabled
  const gemini_info_value = flags.gemini_info.value

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          api_key: apiKey,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>{gemini_info_enabled &&
      <div className="info">
        <p><b>INFO: </b><span dangerouslySetInnerHTML={{ __html: gemini_info_value }}></span></p>
      </div>}
      <div className="login-container">
        <h2>Login with MindsDB to Play MYSTERY POKEMON</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <div className="form-group">
          <label>Email/Username:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>OpenAI API Key:</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging In..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
