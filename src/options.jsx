import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import "./option.css";
import Checkbox from "@mui/material/Checkbox";

function Options() {
   const [popupSynomus, setpopupSynomus] = useState(true);
  const [wordhistorynumber, setwordhistorynumber] = useState(0);
  const [disableLink, setdisableLink] = useState(true);
  const [historyWord, sethistoryWord] = useState(false);
  const [popupAnoymns, setpopupAnoymns] = useState(true);
  const [popupSynomusSelect, setpopupSynomusSelect] = useState(true);
  const [popupAnoymnsSelect, setpopupAnoymnsSelect] = useState(true);
  const [displaypopup, displaypopupSelect] = useState(true);
  const [countword, countwordData] = useState([]);
  document.addEventListener('DOMContentLoaded', restore_options);
  const popupSynomusData = () => {
    setpopupSynomus(!popupSynomus);
  }
  const popupAnoymnsData = () => {
    setpopupAnoymns(!popupAnoymns);
  }
  const popupSynomusSelectData = () => {
    setpopupSynomusSelect(!popupSynomusSelect);
  }
  const popupAnoymnsSelectData = () => {
    setpopupAnoymnsSelect(!popupAnoymnsSelect);
  }
  const displaypopupData = () => {
    displaypopupSelect(!displaypopup);
  }
  const historyWordSelectData = () => {
    sethistoryWord(!historyWord);
  }

  const Clearhistory = () => {
    setdisableLink(true);
    chrome.storage.sync.set({
      countword: []
    });
    setwordhistorynumber(0);
  }


  const save_options = () => {
    console.log("data saved before data", popupSynomus, popupAnoymns, displaypopup, popupSynomusSelect, popupAnoymnsSelect, countword);
    chrome.storage.sync.set({
      popupSynomus: popupSynomus,
      popupAnoymns: popupAnoymns,
      popupSynomusSelect: popupSynomusSelect,
      popupAnoymnsSelect: popupAnoymnsSelect,
      displaypopup: displaypopup,
      countword: countword,
      historyWord: historyWord
    }, function () {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    });

  }

  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      popupSynomus: true,
      popupAnoymns: true,
      popupSynomusSelect: true,
      popupAnoymnsSelect: true,
      displaypopup: true,
      historyWord: false,
      countword: []
    }, function (obj) {
      console.log("restore ", obj);
      setpopupSynomus(obj?.popupSynomus);
      setpopupAnoymns(obj?.popupAnoymns);
      setpopupSynomusSelect(obj?.popupSynomusSelect);
      setpopupAnoymnsSelect(obj?.popupAnoymnsSelect);
      displaypopupSelect(obj?.displaypopup);
      sethistoryWord(obj?.historyWord);
      if (obj?.countword) {
        countwordData(obj?.countword);
      } else {
        countwordData([]);
      }

    });

  }

  useEffect(() => {
    if (wordhistorynumber > 0) {
      setdisableLink(false);
    }
    chrome.storage.sync.get('countword', function (data) {
      // get keys as array
      if (data?.countword && data?.countword?.length > 0) {
        setwordhistorynumber(data?.countword?.length);
        data = data?.countword
        const keys = Object.keys(data[0]);
        const commaSeparatedString = [keys.join(" "), data.map(row => keys.map(key => row[key]).join(" ")).join("\n")].join("\n");
        const csvBlob = new Blob([commaSeparatedString]);
        const downloadlink = document.getElementById("DownloadHistory")

        downloadlink.href = URL.createObjectURL(csvBlob)
      }

    });

  });

  return (
    <div className="option-container">
      <div className="header-container">
        <img className="icon-img" src="icon_48.png" alt="icon"></img>
        <h1 className="title-text">Dictionary World</h1>
      </div>
      <div className="options-wrapper">
        <div className="option-group">
          <h3 className="option-heading">Extension Content</h3>
          <label className="toggle-label">
            <Checkbox
              checked={popupSynomus}
              onChange={popupSynomusData}
            />
            Show Synonyms While Searching in Popup
          </label>
          <label className="toggle-label">
            <Checkbox
              checked={popupAnoymns}
              onChange={popupAnoymnsData}
            />
            Show Antonyms While Searching in Popup
          </label>
        </div>
        <div className="option-group">
          <h3 className="option-heading">Popup Content</h3>
          <label className="toggle-label">
            <Checkbox
              checked={displaypopup}
              onChange={displaypopupData}
            />
            Display Popup on Double Click on Text
          </label>
          <label className="toggle-label">
            <Checkbox
              checked={popupSynomusSelect}
              onChange={popupSynomusSelectData}
            />
            Show Synonyms While Selecting the Text
          </label>
          <label className="toggle-label">
            <Checkbox
              checked={popupAnoymnsSelect}
              onChange={popupAnoymnsSelectData}
            />
            Show Antonyms While Selecting the Text
          </label>
        </div>
        <div className="option-group">
          <h3 className="option-heading">Word History</h3>
          <label className="toggle-label">
            <Checkbox
              checked={historyWord}
              onChange={historyWordSelectData}
            />
            Load Word in Your History
          </label>
          <p className="word-count-text">Number of Words: {wordhistorynumber}</p>
          <div className="button-group">
            <button className="clear-button" onClick={Clearhistory} disabled={disableLink}>Clear History</button>
            <a href="#" className={`download-link ${disableLink ? "disabled" : ""}`} id="DownloadHistory" download="WordHistory.csv">Download History</a>
          </div>
        </div>
      </div>
      <div id="status" className="status-text"></div>
      <button className="save-button" onClick={save_options}>Save</button>
    </div>


  );
}

render(<Options />, document.getElementById("root"));
