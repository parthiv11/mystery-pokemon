import React, { useState, useEffect } from 'react';

function Typist({ text, speed, textSize }) {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset typing animation when text prop changes
    setTypedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    let intervalId;

    if (currentIndex < text.length) {
      intervalId = setInterval(() => {
        setTypedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
    }

    return () => clearInterval(intervalId);
  }, [currentIndex, text, speed]);

  return (
    <span style={{ textAlign:"center", fontSize: textSize}}>
      {typedText}
    </span>
  );
}

export default Typist;
