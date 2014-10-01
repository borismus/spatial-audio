Idea: you are in the middle of a stage surrounded by instruments playing
various parts. You can look all around you to hear and see music coming
from all directions.


# Implementation: polymer.

Each instrument is an element.

    <audio-context>
      <audio-observer
          position="0,0"
          orientation="0,1"/>
      <audio-panner src="sounds/piano.wav"
          gain="0.5"
          position="-1,0"
          orientation="1,0"
          coneInnerAngle="90"
          coneOuterAngle="180"
          coneOuterGain="0.2"/>
      <audio-panner src="sounds/bass.wav"
          position="0,1"
          orientation="0,-1"
          coneInnerAngle="90"
          coneOuterAngle="180"
          coneOuterGain="0.2"/>
      <audio-panner src="sounds/drums.wav"
          position="1,0"
          orientation="-1,0"
          coneInnerAngle="90"
          coneOuterAngle="180"
          coneOuterGain="0.2"/>
    </audio-context>

Play back the right sound, all synchronized.

The API for the world can be clean and well-defined:

    AudioWorld.play()
    AudioWorld.pause()

    AudioObserver.setPosition/setOrientation

