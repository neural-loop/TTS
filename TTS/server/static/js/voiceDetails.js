import helpers from "./helpers.js";
const { q, getTextValue } = helpers;

function getModels(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://huggingface.co/api/models?author=voices", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var models = JSON.parse(xhr.responseText);
      callback(models);
    }
  };
  xhr.send();
}

function updateVoiceDetails() {
  fetch("/get_voices")
    .then(res => {
      if (!res.ok) throw Error(res.statusText);
      return res.json();
    })
    .then(response => {
      let voiceDetailsHTML = "";

      for (const speaker of response) {
        const speakerHTML =
          `<div class="card">
            <div class="label-info">
              ${speaker.speaker_id}: ${speaker.age} year old ${speaker.gender}, ${speaker.accents} accent (${speaker.region})
            </div>
            <div class="player">
              <audio controls>
                <source src="https://huggingface.co/voices/${speaker.project}/resolve/main/samples/${speaker.speaker_id}.wav" type="audio/wav">
              </audio>
            </div>
          </div>`;

        voiceDetailsHTML += speakerHTML;
      }

      document.getElementById("voice-details-container").innerHTML = voiceDetailsHTML;

      getModels(models => {
        let dropdownHTML = '<option value="">Jump to another model...</option>';
        const currentModelPage = getCurrentModelPage();

        for (const model of models) {
          const modelName = model.id.split("/").pop();

          if (modelName.startsWith("VCTK_") && modelName !== currentModelPage) {
            dropdownHTML += `<option value="${model.id}">${modelName}</option>`;
          }
        }

        document.getElementById("model-dropdown").innerHTML = dropdownHTML;
        document.getElementById("current-model").textContent = `Currently evaluating: ${currentModelPage}`;
      });
    })
}

function onModelSelectChange() {
  const selectedModel = document.getElementById("model-dropdown").value;
  const modelName = selectedModel.split("/").pop();
  const modelUrl = `https://voices-${modelName.toLowerCase().replace(/_/g, "-")}.hf.space/`;
  window.location.href = modelUrl;
}

function getCurrentModelPage() {
  var currentUrl = window.location.href;
  var modelPageRegex = /https:\/\/voices-(.*).hf.space/;
  var match = currentUrl.match(modelPageRegex);
  if (match && match.length > 1) {
    var modelName = match[1];
    return "voices/" + modelName.replace(/-/g, "_");
  }
  return "";
}

// Event listeners
window.addEventListener("load", updateVoiceDetails);
document
  .getElementById("model-dropdown")
  .addEventListener("change", onModelSelectChange);
