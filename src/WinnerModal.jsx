import React from "react";
import "./WinnerModal.css"; // Import CSS for styling

const WinnerModal = ({ pokemonImg, pokemonName, handleNewGame }) => {
  return (
    <div className="modal-background">
      <div className="winner-modal">
        <h2>Congratulations!</h2>
        <img src={pokemonImg} alt={pokemonName} />
        <p>You've successfully guessed the Pokémon: {pokemonName}</p>
        <button onClick={handleNewGame}>Play Again</button>
      </div>
    </div>
  );
};

export default WinnerModal;