import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import "./popup.css";

function fetchData(word, setData, setError) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  fetch(url)
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => setError(error));
}

function Popup() {
  const [word, setWord] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.background = "#f0f0f0";
  }, []);

  useEffect(() => {
    setIsSubmitDisabled(!word.trim());
  }, [word]);

  const handleInputChange = event => {
    setWord(event.target.value);
  };

  const handleSearch = () => {
    fetchData(word, setData, setError);
  };

  const playAudio = () => {
    const audio = new Audio(data[0]?.phonetics[0]?.audio);
    audio.play();
  };
  const toggleShow = () =>{
  var el = document.getElementById("box");
  el.classList.toggle("show");
}

  return (
    <div className="container-data">
      <h1 className="heading">Word Lookup</h1>
      <div className="search-container">
        {/* <input
          type="text"
          id="fword"
          name="fword"
          placeholder="Enter a word..."
          value={word}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSearch} disabled={isSubmitDisabled}>
          SEARCH
        </button> */}
          <div class="container-search">
      <input type="text"  placeholder="Search anything..." class="search__box"   value={word}
          onChange={handleInputChange}  id="fword" />
      <img className="search__icon" id="icon"  onClick={handleSearch} src ="search-icon1.png"></img>
  </div>
      </div>
      {error && <div className="error-message">Error: {error.message}</div>}
      {data && (
        <div className="result-container">
          <div className="word-info">
            <h2 className="word">{word}</h2>
            {data[0]?.phonetics[0]?.audio && (
              <button className="audio-button" onClick={playAudio}>
                <img className="audio-icon" src="https://img.icons8.com/ios-filled/25/000000/room-sound.png" alt="sound icon" />
              </button>
            )}
            <p className="definition"><b>Definition:</b> {data[0]?.meanings[0]?.definitions[0]?.definition}</p>
          </div>
          <div className="synonyms">
            <h3>Synonyms:</h3>
            <ul>
              {data[0]?.meanings[0]?.synonyms?.map((synonym, index) => (
                <li key={index}>{synonym}</li>
              ))}
            </ul>
          </div>
          <div className="antonyms">
            <h3>Antonyms:</h3>
            <ul>
              {data[0]?.meanings[0]?.antonyms?.map((antonym, index) => (
                <li key={index}>{antonym}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="footer">
        <p>
          <b>Tip:</b> Double click a word on the page to get its definition.
        </p>
      </div>
      <button className="options-button" onClick={optionsSection}>
        Go to Options
      </button>
    </div>
  );
}

function optionsSection() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
}

render(<Popup />, document.getElementById("react-target"));
