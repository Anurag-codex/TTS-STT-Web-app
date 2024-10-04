const textarea = document.querySelector("textarea");
const translateBtn = document.querySelector("#translateBtn");
const speakBtn = document.querySelector("#speakBtn");
const languageSelect = document.querySelector("#languageSelect");
const outputText = document.querySelector("#outputText");

let isSpeaking = true;

const translateText = async () => {
  const text = textarea.value;
  const targetLang = languageSelect.value;

  if (!text) return;

  outputText.innerText = "Translating...";

  const encodedParams = new URLSearchParams();
  encodedParams.append("q", text);
  encodedParams.append("target", targetLang);
  encodedParams.append("source", "en");

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": "e2ad3202dcmsh5c00e3006ff182dp1f7431jsn95516637606f",
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    },
    body: encodedParams,
  };

  try {
    const response = await fetch(
      "https://google-translate1.p.rapidapi.com/language/translate/v2",
      options
    );
    const result = await response.json();
    outputText.innerText = result.data.translations[0].translatedText;
  } catch (error) {
    outputText.innerText = "Error occurred during translation.";
    console.error("Translation error:", error);
  }
};

const textToSpeech = () => {
  const synth = window.speechSynthesis;
  const text = outputText.innerText || textarea.value;
  const lang = languageSelect.value;

  if (!synth.speaking && text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    synth.speak(utterance);
  }

  if (text.length > 50) {
    if (synth.speaking && isSpeaking) {
      speakBtn.innerText = "Pause";
      synth.resume();
      isSpeaking = false;
    } else {
      speakBtn.innerText = "Resume";
      synth.pause();
      isSpeaking = true;
    }
  } else {
    isSpeaking = false;
    speakBtn.innerText = "Speaking";
  }

  setInterval(() => {
    if (!synth.speaking && !isSpeaking) {
      isSpeaking = true;
      speakBtn.innerText = "Convert to Speech";
    }
  });
};

translateBtn.addEventListener("click", translateText);
speakBtn.addEventListener("click", textToSpeech);

languageSelect.addEventListener("change", () => {
  const selectedLanguage = languageSelect.value;
  textarea.setAttribute("placeholder", `Enter text in ${selectedLanguage}`);
});

// Initialize available voices
speechSynthesis.addEventListener("voiceschanged", () => {
  const voices = speechSynthesis.getVoices();
  console.log("Available voices:", voices);
});

