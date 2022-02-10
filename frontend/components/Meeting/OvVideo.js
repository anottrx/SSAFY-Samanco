import { useState, useEffect, useRef } from 'react';

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
      {/* <div style={{ position: 'absolute' }}>{audioStatus}</div> */}
      <video autoPlay={true} ref={videoRef} />
    </>
  );
}

export default OpenViduVideoComponent;
