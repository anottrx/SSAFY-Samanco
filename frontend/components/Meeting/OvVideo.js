import { useEffect, useRef } from 'react';

function OpenViduVideoComponent({ streamManager }) {
  const videoRef = useRef();

  useEffect(() => {
    if (streamManager && !!videoRef) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, []);

  return <video autoPlay={true} ref={videoRef} />;
}

export default OpenViduVideoComponent;
