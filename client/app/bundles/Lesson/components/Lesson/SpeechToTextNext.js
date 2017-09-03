export default class SpeechToTextNext {

  /*
  Arguments for the constructor.
  onAnythingSaid - a callback that will be passed interim transcriptions
  (fairly immediate, less accurate)
  onFinalised - a callback that will be passed the finalised transcription from the cloud
  (slow, much more accuate)
  onFinishedListening - a callback that will be called when the speech recognition stops listening
  language - the language to interpret against. Default is US English.
  */
  constructor(onAnythingSaid, onFinalised, onFinishedListening, language = 'en-US') {
    // Check to see if this browser supports speech recognition
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error("This browser doesn't support speech recognition. Try Google Chrome.");
    }

    const WebkitSpeechRecognition = window.webkitSpeechRecognition;
    this.recognition = new WebkitSpeechRecognition();

    //  Keep listening even if the speaker pauses, and return interim results.
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = language;

    let finalTranscript = '';

    // process both interim and finalised results
    this.recognition.onresult = (event) => {
      let interimTranscript = '';

      // concatenate all the transcribed pieces together (SpeechRecognitionResult)
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcriptionPiece = event.results[i][0].transcript;
        const transcriptionConfidence = event.results[i][0].confidence;
        // check for a finalised transciption in the cloud
        if (event.results[i].isFinal) {
          finalTranscript += transcriptionPiece;
          onFinalised(finalTranscript, transcriptionConfidence);
          finalTranscript = '';
        } else {
          interimTranscript += transcriptionPiece;
          onAnythingSaid(interimTranscript, transcriptionConfidence);
        }
      }
    };

    this.recognition.onend = () => onFinishedListening();
  }

  /*
  Explicitly start listening.
  Listening will need to be started again after a finalised result is returned.
  */
  startListening() {
    this.recognition.start();
  }
}