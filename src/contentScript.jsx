import "./contentscript.css";

function getSelectionText(datavalue, e) {
  var popupLeft, popupTop;
  var mouseX = e.pageX;
  var mouseY = e.pageY;
  var iDiv = document.getElementsByClassName("blocksearch_detail_data");
  if (iDiv == undefined || iDiv.length == 0) {
    iDiv = document.createElement('div');
    iDiv.className = 'blocksearch_detail_data';
    document.getElementsByTagName('body')[0].appendChild(iDiv);
  } else {
    iDiv = iDiv[0];
  }
  var popupWidth = 300;
  var popupHeight = iDiv.offsetHeight;

  var windowWidth = document.documentElement.clientWidth + window.screenTop;
  var windowHeight = document.documentElement.clientHeight + window.screenLeft;
  if (mouseX + popupWidth > windowWidth) {
    popupLeft = mouseX - popupWidth;
  }
  else {
    popupLeft = mouseX;
  }

  var scroll = window.pageYOffset;
  if (mouseY - scroll < popupHeight) {
    popupTop = mouseY;
  }
  else if (mouseY + popupHeight > windowHeight) {
    popupTop = mouseY - popupHeight;
  }
  else {
    popupTop = mouseY;
  }

  if (popupLeft < 0)
    popupLeft = 0;
  if (popupTop < 0)
    popupTop = 0;
  iDiv.style.top = `${popupTop}px`;
  iDiv.style.left = `${popupLeft}px`;

  iDiv.style.display = "block";


  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${datavalue}`;
  fetch(url)
    .then(response => response.json())
    .then(response => {
      if (response && response[0]?.meanings[0]?.definitions[0]?.definition) {
        iDiv.innerHTML = "";
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
          iDiv.innerHTML = `<div class="word-value-data-detail">${datavalue} <audio id="player" src="${audiodataUrl}"></audio>
        <div> 
          <button class="button-sound-word-data" onclick="document.getElementById('player').play()"><img class="word-record-sound-data" src="https://img.icons8.com/ios-filled/25/000000/room-sound.png"></img></button> 
        </div></div><b>Defination:</b><br>${response && response[0]?.meanings[0]?.definitions[0]?.definition}`;
        } else {
          iDiv.innerHTML = `<div class="word-value-data-detail">${datavalue}</div><b>Defination:</b><br>${response && response[0]?.meanings[0]?.definitions[0]?.definition}`;
        }
        iDiv.style.height = "auto";
        iDiv.style.display = "inline-block";

        chrome.storage.sync.get('historyWord', function (responsedata) {
          if (responsedata?.historyWord) {
            chrome.storage.sync.get('countword', function (response1) {
              let countstoreData = {
                Define: datavalue,
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
        iDiv.innerHTML = "Not Found.....";
      }
      //synoymns
      chrome.storage.sync.get('popupSynomusSelect', function (obj) {
        if (Object.keys(obj).length === 0 || obj?.popupSynomusSelect) {
          if (response && response[0]?.meanings[0]?.synonyms) {
            let synonymsData = response && response[0]?.meanings[0]?.synonyms;
            var nHTML = '';
            synonymsData.forEach(function (item) {
              nHTML += item + ', ';
            });
            iDiv.innerHTML = iDiv.innerHTML + '<br><div class="word-value-data-detail-synoynms"><b>synonyms:</b><br>' + nHTML + '</div>';
          }
        }
      });

      //antomns

      chrome.storage.sync.get('popupAnoymnsSelect', function (obj) {

        if (Object.keys(obj).length === 0 || obj?.popupAnoymnsSelect) {
          if (response && response[0]?.meanings[0]?.antonyms) {
            let antonymsData = response && response[0]?.meanings[0]?.antonyms;
            var anHTML = '';
            antonymsData.forEach(function (item) {
              anHTML += item + ', ';
            });
            iDiv.innerHTML = iDiv.innerHTML + '<br><div class="word-value-data-detail-antoymns"><b>Antonyms:</b><br>' + anHTML + '</div>';

          }
        }
      });

    }).catch(err => {
      console.error(err)
      iDiv.innerHTML = "Not Found.....";
    });


}
document.ondblclick = function (e) {
  chrome.storage.sync.get('displaypopup', function (obj) {
    console.log("obj", obj);
    if (Object.keys(obj).length === 0 || obj?.displaypopup) {
      var sel = (document.selection && document.selection.createRange().text) ||
        (window.getSelection && window.getSelection().toString());
      if (sel?.length > 0) {
        getSelectionText(sel, e);
      }
    }
  });

};
document.onclick = function (e) {
  if (e?.target?.className != "word-record-sound-data") {
    var iDivdata = document.getElementsByClassName("blocksearch_detail_data");
    if (iDivdata != undefined && iDivdata.length != 0) {
      iDivdata[0].style.display = "none";
    }
  }
};

