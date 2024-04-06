import React, { useState, useEffect } from "react";
import "./Game.css";
import Typist from "./Typist.jsx";
import GameModelOverlay from "./GameOverModal.jsx";
import WinnerModal from "./WinnerModal.jsx"; 
import Eyes from "./Eyes.jsx";
import flagsmith from 'flagsmith';
import { useFlags, useFlagsmith } from 'flagsmith/react';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


function Game() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonSound, setPokemonSound] = useState("");
  const [pokemonImg, setPokemonImg] = useState("./assets/poke.svg");
  const [gameState, setGameState] = useState({
    isPlaying: false,
    questionCount: 0,
    correctGuess: false,
    gameOver: false,
    answer: "",
    isAnswering: false,
  });
  const [isListening, setIsListening] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const flags = useFlags(['speech_enabled']); // only causes re-render if specified flag values / traits change
  const speech_enabled = flags.speech_enabled.enabled


  useEffect(() => {
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
    if (isListening) {
      const recognition = new window.webkitSpeechRecognition(); 
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
        "Authorization": `${localStorage.getItem("token")}`,
        
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
        if (type === "yes") {
          // happy eyes
        } else if (type === "no") {
          // sad eyes
        } else if (type === "won") {
          setGameState((prevState) => ({
            ...prevState,
            correctGuess: true,
          }));
          setTimeout(() => {
            fetch(`${BACKEND_URL}/get_media/${pokemonName}`)
              .then((response) => response.json())
              .then((data) => {
                setPokemonImg(data["img"]);
                setPokemonSound(data["ogg"]);
              });
          }, 3000);
        } else {
          // roll eyes
        }

        speakAnswer(data["answer"]);

        if (gameState.questionCount + 1 >= 20 || gameState.correctGuess) {
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

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <div className="App">
      <div className="center">
        <Eyes animation={isInputFocused ? 'look-down' : null}/>
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
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
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
          disabled={speech_enabled === false}
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
        {/* Winner Modal */}
        {gameState.correctGuess && (
          <WinnerModal
            pokemonImg={pokemonImg}
            pokemonName={pokemonName}
            handleNewGame={handleNewGame}
          />
        )}
      </div>
    </div>
  );
}


export default Game;
