import React, { useState, useEffect, useRef } from 'react';

function OpenViduVideoComponent({ streamManager }) {
  const videoRef = useRef();
  const [audioStatus, setAudioStatus] = useState('...loading');

  useEffect(() => {
    if (streamManager && !!videoRef) {
      streamManager?.addVideoElement(videoRef?.current);
    }
  }, []);

  useEffect(() => {
    if (streamManager)
      setAudioStatus(streamManager.properties.publishAudio + '');
  }, [streamManager]);

  return (
    <>
      <video
        autoPlay={true}
        ref={videoRef}
        style={{ borderRadius: '5px', border: '1px solid gdray' }}
      />
    </>
  );
}

export default React.memo(OpenViduVideoComponent);
