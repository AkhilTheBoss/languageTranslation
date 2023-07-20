import React, { useState } from "react";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const AudioPlayer = ({ base64Audio }) => {
  const audioData = `data:audio/mp3;base64,${base64Audio}`;
  return <audio controls src={audioData} />;
};

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [text, setText] = useState("");
  const [audioText, setAudioText] = useState("");
  const [isAudio, setIsAudio] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");

  const languages = [
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Canadian French",
    "Catalan",
    "Chinese",
    "Chinese Traditional",
    "Croatian",
    "Czech",
    "Danish",
    "Dari",
    "Dutch",
    "English",
    "Estonian",
    "Finnish",
    "French",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Haitian Creole",
    "Hausa",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Kannada",
    "Kazakh",
    "Korean",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Malay",
    "Malayalam",
    "Maltese",
    "Marathi",
    "Mexican Spanish",
    "Mongolian",
    "Norwegian",
    "Pashto",
    "Persian",
    "Polish",
    "Portugal Portuguese",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Serbian",
    "Sinhala",
    "Slovak",
    "Slovenian",
    "Somali",
    "Spanish",
    "Swahili",
    "Swedish",
    "Tagalog",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Vietnamese",
    "Welsh",
  ];

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const callAPI = (transcript, selectedItem) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        httpMethod: "POST",
        Test: transcript,
        Language: selectedItem,
      }),
      redirect: "follow",
    };

    fetch(
      "https://ydmv8ocd3f.execute-api.us-east-2.amazonaws.com/TT",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const parsedResult = JSON.parse(result);
        // alert(parsedResult.body.Text);
        setText(parsedResult.body.Text);
        if (parsedResult.isbase64Encoded) {
          setAudioText(parsedResult.body.Audio);
        }
        setIsAudio(parsedResult.isbase64Encoded);
      })
      .catch((error) => console.log("error", error));
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="Surround">
      <div className="App">
        <select value={selectedItem} onChange={handleSelectChange}>
          <option value="">Select an item</option>
          {languages.map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
        <p>Selected item: {selectedItem}</p>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <div>
          {listening ? (
            <BsFillMicFill
              size={30}
              onClick={SpeechRecognition.startListening}
            />
          ) : (
            <BsFillMicMuteFill
              size={30}
              onClick={SpeechRecognition.startListening}
            />
          )}
        </div>
        <button onClick={SpeechRecognition.startListening}>Start</button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>

        <button onClick={() => callAPI(transcript, selectedItem)}>
          Call API
        </button>

        <p>Text: {text}</p>
        <div>
          {!isAudio &&
            "Sorry, we can only provide a translation as text and not speech for this language. Apologies"}
        </div>
        {isAudio && audioText && <AudioPlayer base64Audio={audioText} />}
      </div>
    </div>
  );
};

export default Dictaphone;
