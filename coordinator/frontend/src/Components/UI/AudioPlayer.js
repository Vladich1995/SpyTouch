import React from 'react';

const AudioPlayer = ({ audioUrl }) => {
    console.log(audioUrl)

  return (
    <audio controls>
      <source src={audioUrl} type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;