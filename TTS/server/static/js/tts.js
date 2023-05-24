import helpers from "./helpers.js";
const { q, getTextValue } = helpers;

q("#text").focus();

export function runRecaptcha() {
  grecaptcha.ready(function() {
    grecaptcha.execute('6LcAIDMmAAAAABL3yaRbEP12AK-gy56b4S9SN6Mf').then(function(token) {
      do_tts(token);
    });
  });
}

function do_tts(recaptchaToken) {
  const text = q("#text").value;
  const speaker_id = getTextValue("#speaker_id");
//  const speaker_id = 'male-en-2';
  const style_wav = getTextValue("#style_wav");
  const language_id = getTextValue("#language_id");
//  const language_id = 'en';
  if (text) {
    q("#message").textContent = "Synthesizing...";
    q("#speak-button").disabled = true;
    q("#audio").hidden = true;
    synthesize(text, speaker_id, style_wav, language_id, recaptchaToken);
  }
}

q("#text").addEventListener("keyup", function (e) {
  if (e.keyCode == 13) { // enter
    runRecaptcha(); // Call runRecaptcha() here instead of do_tts(e)
  }
});

q("#text").addEventListener("input", function() {
  const inputText = this.value;
  console.log(inputText);
  // Define the allowed characters
  const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz¯·ßàáâãäæçèéêëìíîïñòóôõöùúûüÿāąćēęěīıłńōőœśūűźżǎǐǒǔабвгдежзийклмнопрстуфхцчшщъыьэюяёєіїґ–!'(),-.:;? ";

  // Check if the input contains any unallowed characters
  const containsUnallowedChars = [...inputText].some(char => !allowedChars.includes(char));

  if (containsUnallowedChars) {
    // Display an error message or perform any other action
    // when unallowed characters are found in the input
    console.log("Unallowed character found!");
    q('#text-notice').textContent = "Input character not utilized in model implementation.";
    q('#speak-button').disabled = true;

  } else {
    // The input is valid
    console.log("Input is valid.");
    q('#text-notice').textContent = "\u00A0";
    q('#speak-button').disabled = false;
  }
});

function synthesize(text, speaker_id = "", style_wav = "", language_id = "", recaptchaToken = "") {
  fetch(
    `/api/tts?text=${encodeURIComponent(text)}&speaker_id=${encodeURIComponent(speaker_id)}&style_wav=${encodeURIComponent(style_wav)}&language_id=${encodeURIComponent(language_id)}&recaptcha-response=${encodeURIComponent(recaptchaToken)}`,
    { cache: "no-cache" }
  )
    .then(function (res) {
      if (!res.ok) throw Error(res.statusText);
      return res.blob();
    })
    .then(function (blob) {
      q("#message").textContent = "";
      q("#speak-button").disabled = false;
      q("#audio").src = URL.createObjectURL(blob);
      q("#audio").hidden = false;
    })
    .catch(function (err) {
      q("#message").textContent = "Error: " + err.message;
      q("#speak-button").disabled = false;
    });
}

window.onload = function() {
  // Enable the "speak-button" once the page has completely loaded
  q("#speak-button").disabled = false;
  console.log("Page loaded.");
}