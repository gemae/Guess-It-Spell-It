import React, { useState, useEffect } from 'react';
import './css/style.css';
import apple from './assets/apple.png';
import orange from './assets/orange.png';
import avocado from './assets/avocado.png';
import banana from './assets/banana.png';
import carrots from './assets/carrots.png';
import cherry from './assets/cherry.png';
import grapes from './assets/grapes.png';
import lemon from './assets/lemon.png';
import pineapple from './assets/pineapple.png';
import strawberry from './assets/strawberry.png';

const objects = [
  { name: 'apple', image: apple },
  { name: 'orange', image: orange },
  { name: 'avocado', image: avocado },
  { name: 'banana', image: banana },
  { name: 'carrots', image: carrots },
  { name: 'cherry', image: cherry },
  { name: 'grapes', image: grapes },
  { name: 'lemon', image: lemon },
  { name: 'pineapple', image: pineapple },
  { name: 'strawberry', image: strawberry }
];

function getRandomObject() {
  return objects[Math.floor(Math.random() * objects.length)];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function GuessItSpellIt() {
  const [currentObject, setCurrentObject] = useState(getRandomObject());
  const [selectedLetters, setSelectedLetters] = useState(Array(currentObject?.name.length || 0).fill(null));
  const [randomLetters, setRandomLetters] = useState([]);
  const [clickedButtons, setClickedButtons] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (currentObject) {
      const letters = currentObject.name.split('');
      while (letters.length < 10) {
        const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        letters.push(randomLetter);
      }
      setRandomLetters(shuffleArray(letters));
      setClickedButtons(new Array(letters.length).fill(false));
      setSelectedLetters(Array(currentObject.name.length).fill(null)); 
    }
  }, [currentObject]);

  const handleLetterClick = (letter, index) => {
    const firstEmptyIndex = selectedLetters.indexOf(null);
    if (firstEmptyIndex !== -1 && !clickedButtons[index]) {
      const updatedSelectedLetters = [...selectedLetters];
      updatedSelectedLetters[firstEmptyIndex] = { letter, index };
      setSelectedLetters(updatedSelectedLetters);

      const updatedClickedButtons = [...clickedButtons];
      updatedClickedButtons[index] = true;
      setClickedButtons(updatedClickedButtons);
    }
  };

  const handleClearLetter = (letterIndex) => {
    const updatedSelectedLetters = [...selectedLetters];
    const letterToRemove = updatedSelectedLetters[letterIndex];
    updatedSelectedLetters[letterIndex] = null;
    setSelectedLetters(updatedSelectedLetters);

    if (letterToRemove) {
      const updatedClickedButtons = [...clickedButtons];
      updatedClickedButtons[letterToRemove.index] = false;
      setClickedButtons(updatedClickedButtons);
    }
  };

  const resetGame = () => {
    setSelectedLetters([]);
    setClickedButtons([]);
    
    // Temporarily set currentObject to null to force useEffect to trigger
    setCurrentObject(null);
    
    setTimeout(() => {
      setCurrentObject(getRandomObject());
    }, 0);
  };

  const clearGame = () => {
    setSelectedLetters(Array(currentObject?.name.length || 0).fill(null));
    setClickedButtons([]);
  };

  const handleCorrectAnswer = () => {
    setPoints(points + 1);
    resetGame();
  };

  const selectedWord = selectedLetters.map(item => item?.letter || '').join('');

  return (
    <div className="game-container">
      <h1 className="title">Guess the object and spell it correctly</h1>

      <div className="game-wrapper">
          {currentObject && (
            <>
              <img src={currentObject.image} alt="object" className="object-image" />
              <div className="blank-card">
                {selectedLetters.map((item, index) => (
                  <span key={index} className="letter" onClick={() => handleClearLetter(index)}>
                    {item ? item.letter : ''}
                  </span>
                ))}
              </div>
              <div className="letter-buttons">
                {randomLetters.map((letter, index) => (
                  <button
                    key={index}
                    onClick={() => handleLetterClick(letter, index)}
                    className="letter-button"
                    disabled={clickedButtons[index]}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </>
          )}
          {selectedWord === currentObject?.name && (
            <div className="result">
              <h2>Correct! The word is {currentObject.name}</h2>
              <button onClick={handleCorrectAnswer} className="next-button">Next Object</button>
            </div>
          )}
          {selectedWord.length === currentObject?.name.length && selectedWord !== currentObject.name && (
            <div className="result incorrect">
              <h2>Oops! Give it another try and spell it correctly!</h2>
              <button onClick={clearGame} className="clear-button">Clear</button>
            </div>
          )}
      </div>
       <div className="result-wrapper">
        <div className="points">Points: {points}</div>
      </div>
    </div>
  );
}

export default GuessItSpellIt;
