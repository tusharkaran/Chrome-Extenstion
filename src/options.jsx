import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import "./option.css";

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
    <div class="whole-chontainer-data-details">
      <div class="main-data-title-details">
        <div class="main-data-title-details-data">
          <img class="img-icon-options" src="icon_48.png"></img>
          <h1>Dictonary World</h1>
        </div>
        <h2 class="heading-tag-second">Extension Option</h2>
      </div>
      <div class="main-data">

        <div class="popup-data">
          <span class="heading text">Extension Content</span>
          <div class="item-data">
            <label>
              Show synonyms While Searching in Popup :
              <input type="checkbox" id="popupSynomusnew" checked={popupSynomus} onChange={popupSynomusData} />

            </label>
          </div>
          <div class="item-data">
            <label>
              Show Antonyms While Searching in Popup :
              <input type="checkbox" id="popupAnoymns" checked={popupAnoymns} onChange={popupAnoymnsData} />
            </label>
          </div>
        </div>
        <div class="popup-data">
          <span class="heading text">Popup Content</span>
          <div class="item-data">
            <label>
              Display Popup on double click on text:
              <input type="checkbox" id="displaypopup" checked={displaypopup} onChange={displaypopupData} />
            </label>
          </div>
          <div class="item-data">
            <label>
              Show synonyms While Selecting the text:
              <input type="checkbox" id="popupSynomusSelect" checked={popupSynomusSelect} onChange={popupSynomusSelectData} />
            </label>
          </div>
          <div class="item-data">
            <label>
              Show Antonyms While Selecting the text :
              <input type="checkbox" id="popupAnoymnsSelect" checked={popupAnoymnsSelect} onChange={popupAnoymnsSelectData} />
            </label>
          </div>
        </div>
        <div class="popup-data">
          <span class="heading text">Word History</span>
          <div class="item-data">
            <label>
              Load word in you history:
              <input type="checkbox" id="historyWord" checked={historyWord} onChange={historyWordSelectData} />
            </label>
          </div>
          <div class="item-data">
            <label>
              Number of word are {wordhistorynumber}
            </label>
          </div>
          <div class="item-data button-history" >
            <button id="histordatabutton" onClick={Clearhistory}>Clear History </button>
            <a class={ disableLink ? "downloadhistory disablelinkactivity" : "downloadhistory"} id="DownloadHistory"  download="WordHistory.csv">Download History </a>
          </div>
        </div>
        <div id="status"></div>
        <button id="save" onClick={save_options}>Save</button>

      </div>
    </div>
  );
}
render(<Options />, document.getElementById("root"));