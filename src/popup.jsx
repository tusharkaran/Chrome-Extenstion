import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import "./popup.css";

function Popup() {
  const [submit, setdisablesubmit] = useState(true);
  function messageChange(event) {
    event.target.value.length >= 1 ? setdisablesubmit(false) : setdisablesubmit(true);
  }


  const optionsSection = () => {


    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  }


  const searchword = () => {
    let word = document.getElementById("fword").value;
    let container = document.getElementById("child-container-answer");
    let synonms = document.getElementById("child-container-answer-synonms");
    let antonms = document.getElementById("child-container-answer-antonyms");

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
      .then(response => response.json())
      .then(response => {

        //meaning 
        if (response && response[0]?.meanings[0]?.definitions[0]?.definition) {
          container.innerHTML = "";
          var audiodataUrl;
          var phoneticsData = response && response[0]?.phonetics;
          if (phoneticsData) {
            for (let phoneticsCounter = 0; phoneticsCounter < phoneticsData.length; phoneticsCounter++) {
              if (phoneticsData[phoneticsCounter]?.audio) {
                audiodataUrl = phoneticsData[phoneticsCounter]?.audio;
              }
            }
          }
          if (audiodataUrl) {
            container.innerHTML = `<div class="word-value-data-detail-popup">${word} <audio id="playerpopup" src="${audiodataUrl}"></audio>
          <div> 
            <button class="button-sound-word-data-popup" ><img id="word-record-sound-data-popup" class="word-record-sound-data-popup" src="https://img.icons8.com/ios-filled/25/000000/room-sound.png"></img></button> 
          </div></div><b>Defination:</b><br>${response && response[0]?.meanings[0]?.definitions[0]?.definition}`;
          } else {
            container.innerHTML = `<div class="word-value-data-detail-popup">${word}</div><b>Defination:</b><br>${response && response[0]?.meanings[0]?.definitions[0]?.definition}`;
          }

          chrome.storage.sync.get('historyWord', function (responsedata) {
            if (responsedata?.historyWord) {
              chrome.storage.sync.get('countword', function (response1) {
                console.log("popup",response1);
                
                let countstoreData = {
                  Define: word,
                  Meaning: response && response[0]?.meanings[0]?.definitions[0]?.definition
                }
                response1 = response1.countword;
                let valuedata = [];
                if (response1?.length == 0) {
                  valuedata[0] = countstoreData;
                } else {
                  response1[response1.length] = countstoreData;
                  valuedata = response1;
                }
                chrome.storage.sync.set({
                  countword: valuedata
                });

              });
            }

          });

        } else {
          container.innerHTML = "Not Found.....";
        }

        //synonums
        chrome.storage.sync.get('popupSynomus', function (obj) {
          if (Object.keys(obj).length === 0 || obj?.popupSynomus) {

            if (response && response[0]?.meanings[0]?.synonyms) {
              let synonymsData = response && response[0]?.meanings[0]?.synonyms;
              var nHTML = '';
              synonymsData.forEach(function (item) {
                nHTML += '<li>' + item + '</li>';
              });
              synonms.innerHTML = '<b>synonyms:</b><br><ul class="two-coloum-data-show">' + nHTML + '</ul>';


            } else {
              synonms.innerHTML = "Not Found.....";
            }
          }
        });
        //antonyms
        chrome.storage.sync.get('popupAnoymns', function (obj) {
          if (Object.keys(obj).length === 0 || obj?.popupAnoymns) {
            if (response && response[0]?.meanings[0]?.antonyms) {
              let antonymsData = response && response[0]?.meanings[0]?.antonyms;
              var anHTML = '';
              antonymsData.forEach(function (item) {
                anHTML += '<li>' + item + '</li>';
              });
              antonms.innerHTML = '<b>Antonyms:</b><br><ul class="two-coloum-data-show">' + anHTML + '</ul>'

            } else {
              antonms.innerHTML = "Not Found.....";
            }
          }
        });

      })
      .catch(err => {
        console.error(err)
        container.innerHTML = "Not Found.....";
        synonms.innerHTML = "Not Found.....";
        antonms.innerHTML = "Not Found.....";
      })

  }


  useEffect(() => {
    document.getElementsByTagName('body')[0].style.background = "rgb(197 238 245)";
    document.addEventListener('click', function (event) {
      if (event?.target?.className == "word-record-sound-data-popup") {
        document.getElementById('playerpopup').play();
      }
    });
  });



  return (

    <div class="container">
      <div id="child-container-data" class="child-container-data">
        <input type="text" id="fword" name="fword" placeholder="Please enter the word " onChange={messageChange}></input>
        <button className="data-search-button" onClick={searchword} disabled={submit}>SEARCH</button>
      </div>
      {/* <span> <b>Defination: </b></span> */}
      <div id="child-container-answer" class="child-container-answer">

      </div>
      {/* <span> <b>Synonms: </b></span> */}
      <div id="child-container-answer-synonms" class="child-container-answer-synonms">

      </div>
      {/* <span> <b>Antonyms: </b></span> */}
      <div id="child-container-answer-antonyms" class="child-container-answer-antonyms">

      </div>
      <div id="footer-data-chrome"><p><b>Tip </b>: Double Click the word on the page to get defination.</p></div>
      <button id="go-to-options" onClick={optionsSection}>Go to options</button>
    </div>


  );

}
render(<Popup />, document.getElementById("react-target"));