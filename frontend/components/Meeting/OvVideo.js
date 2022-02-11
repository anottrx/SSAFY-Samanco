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
      {/* <div style={{ backgroundColor: 'white', position: 'absolute' }}>
        {audioStatus}
      </div> */}
      <video autoPlay={true} ref={videoRef} style={{ borderRadius: '5px' }} />
    </>
  );
}

export default OpenViduVideoComponent;
