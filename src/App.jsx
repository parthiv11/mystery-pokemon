import React, { useState, useEffect } from "react";
import "./App.css";
import Typist from "./Typist.jsx";
import GameModelOverlay from "./GameOverModal.jsx";
import Eyes from "./Eyes.jsx";

BACKEND_URL = process.env.BACKEND_URL 

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonSound, setPokemonSound] = useState("");
  const [pokemonImg, setPokemonImg] = useState("./assets/poke.svg");
  const [gameState, setGameState] = useState({
    isPlaying: false,
    questionCount: 19,
    correctGuess: false,
    gameOver: false,
    answer: "",
    isAnswering: false,
  });
  const [isListening, setIsListening] = useState(false); // State to manage speech recognition

  useEffect(() => {
    // Fetch the initial Pokémon name when the component mounts
    fetch(`${BACKEND_URL}/new_game`)
      .then((response) => response.json())
      .then((data) => {
        setPokemonName(data["pokemonName"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    // Initialize speech recognition when component mounts

    if (isListening) {
      const recognition = new window.webkitSpeechRecognition(); // for Chrome
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("question").value = transcript;
      };
      recognition.start();
      recognition.onend = () => {
        setIsListening(false);
      };
      return () => {
        recognition.stop();
      };
    }
  }, [isListening]);

  const toggleSpeechRecognition = () => {
    setIsListening(!isListening);
  };

  const startGame = () => {
    setGameState({
      isPlaying: true,
      questionCount: 19,
      correctGuess: false,
      gameOver: false,
      answer: "",
    });
  };

  const askQuestion = () => {
    const question = document.querySelector("#question").value;

    setGameState((prevState) => ({
      ...prevState,
      isAnswering: true,
    }));

    fetch(`${BACKEND_URL}/ask_question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        pokemonName: pokemonName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGameState((prevState) => ({
          ...prevState,
          answer: data["answer"],
          isAnswering: false,
          questionCount: prevState.questionCount + 1,
        }));
        const type = data["type"];
        console.log(type);
        if (type=='yes') {
          // happy eyes
        }
        else if (type=='no') {
          // sad eyes
        }
        else if (type=='won') {
          // WonModal
        }
        else{
            // roll eyes
        }

        speakAnswer(data["answer"]);

        // Check if it's the last question, then wait for 3 seconds before showing game over modal
        if (gameState.questionCount + 1 >= 20) {
          setTimeout(() => {
            fetch(`${BACKEND_URL}/get_media/${pokemonName}`)
              .then((response) => response.json())
              .then((data) => {
                setPokemonImg(data["img"]);
                setPokemonSound(data["ogg"]);
              });
            speakAnswer(
              `Oh no! You ran out of questions! I am ${pokemonName}! Try again `
            );
            setGameState((prevState) => ({
              ...prevState,
              gameOver: true,
            }));
          }, 3000);
          // playSound();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const playSound = () => {
    const audio = new Audio(pokemonSound);
    console.log("Playing sound...");
    console.log(pokemonSound);
    //settimeout to play sound after 3 seconds
    setTimeout(() => {
      audio.play();
    }, 3000);
  };

  const speakAnswer = (answer) => {
    const utterance = new SpeechSynthesisUtterance(answer);
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      askQuestion();
    }
  };

  const handleNewGame = () => {
    startGame();
  };

  return (
    <div className="App">
      <div className="center">
        <Eyes />
        {gameState.answer && (
          <Typist text={gameState.answer} speed={50} textSize={60} />
        )}

        <input
          id="question"
          type="text"
          placeholder="Ask a question"
          style={{ fontSize: "24px" }}
          autoComplete="off"
          disabled={gameState.isAnswering || isListening} 
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={askQuestion}
          disabled={gameState.isAnswering || isListening} 
          style={{ marginTop: "10px", fontSize: "20px" }}
        >
          Ask
        </button>

        {/* Microphone button to toggle speech recognition */}
        <button
          onClick={toggleSpeechRecognition}
          style={{ marginTop: "10px", fontSize: "20px" }}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>

        {/* Show question count and game over modal */}
        <div
          style={{
            marginTop: "10px",
            fontSize: "20px",
            color: "white",
            marginBottom: "15px",
          }}
        >
          Question Count: {gameState.questionCount}
        </div>
        {gameState.gameOver && (
          <GameModelOverlay
            pokemonImg={pokemonImg}
            pokemonName={pokemonName}
            handleNewGame={handleNewGame}
          />
        )}
      </div>
    </div>
  );
}

export default App;
