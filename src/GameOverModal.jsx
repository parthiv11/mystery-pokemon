import React from "react";

const GameOverModal = ({ pokemonImg, pokemonName, handleNewGame}) => {

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Oh no! You're out of luck!
          </p>
          <p style={{ fontSize: "18px", color: "#666" }}>
            But don't worry, try again!
          </p>
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={pokemonImg}
            alt="Game Over Pokemon"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
            }} // Adjust width, height, border-radius, and box-shadow
          />
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              marginTop: "10px",
            }}
          >
            {pokemonName}
          </p>
        </div>
        <button
          onClick={handleNewGame}
          style={{
            display: "block",
            margin: "0 auto",
            padding: "10px 20px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
            transition: "background-color 0.3s",
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
