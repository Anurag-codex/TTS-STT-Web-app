document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");
    const startBtn = document.getElementById("start-btn");
  
    // Check for browser support
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Set to false to stop after a sentence
      recognition.interimResults = true;
      recognition.lang = "en-US";
  
      startBtn.addEventListener("click", () => {
        try {
          recognition.start();
          startBtn.disabled = true;
          startBtn.innerText = "Listening...";
          output.innerText = "Listening...";
        } catch (err) {
          output.innerText = "Error starting recognition: " + err.message;
          console.error("Error starting speech recognition:", err);
          startBtn.disabled = false;
          startBtn.innerText = "Start Recording";
        }
      });
  
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
  
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
  
        output.innerHTML = finalTranscript + '<i style="color: #999;">' + interimTranscript + '</i>';
  
        if (finalTranscript) {
          startBtn.disabled = false;
          startBtn.innerText = "Start Recording";
  
          // Read the recognized text aloud
          const utterance = new SpeechSynthesisUtterance(finalTranscript);
          utterance.lang = "en-US";
          window.speechSynthesis.speak(utterance);
        }
      };
  
      recognition.onend = () => {
        console.log("Speech recognition ended.");
        startBtn.disabled = false;
        startBtn.innerText = "Start Recording";
        if (output.innerText === "Listening...") {
          output.innerText = "No speech detected, please try again.";
        }
      };
  
      recognition.onerror = (event) => {
        let errorMessage = "An error occurred: ";
        switch (event.error) {
          case "no-speech":
            errorMessage += "No speech was detected.";
            break;
          case "audio-capture":
            errorMessage += "Please ensure your microphone is working.";
            break;
          case "not-allowed":
            errorMessage += "Microphone access was denied.";
            break;
          default:
            errorMessage += event.error;
            break;
        }
        console.error("Speech recognition error:", event.error);
        output.innerText = errorMessage;
        startBtn.disabled = false;
        startBtn.innerText = "Start Recording";
      };
    } else {
      output.innerText = "Sorry, your browser does not support Speech Recognition.";
      startBtn.disabled = true;
    }
  });
  
