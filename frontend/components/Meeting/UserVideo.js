// import OpenViduVideoComponent from './OvVideo';
// import styled from '@emotion/styled';

// function UserVideo({ streamManager }) {
//   const NoVideo = styled.div`
//     width: 320px;
//     height: 240px;
//     border: 1px solid gray;
//     border-radius: 5px;
//     background-image: url('/images/profile_default_gen0.png');
//     background-size: 30%;
//     background-repeat: no-repeat;
//     background-position: center center;
//   `;

//   console.log('-------------user', streamManager);
//   return (
//     <div>
//       {streamManager && !streamManager.properties.publishVideo && (
//         <NoVideo className="streamcomponent"></NoVideo>
//       )}
//       {streamManager && streamManager.properties.publishVideo && (
//         <div className="streamcomponent">
//           <OpenViduVideoComponent streamManager={streamManager} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserVideo;
import React from 'react';
import OpenViduVideoComponent from './OvVideo';
import styled from '@emotion/styled';

function UserVideo({ streamManager }) {
  const NoVideo = styled.div`
    width: 320px;
    height: 240px;
    border: 1px solid gray;
    border-radius: 5px;
    background-image: url('/images/profile_default_gen0.png');
    background-size: 30%;
    background-repeat: no-repeat;
    background-position: center center;
  `;

  // console.log('-------------user', streamManager);
  return (
    <div>
      {streamManager !== undefined && streamManager.stream.videoActive ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
        </div>
      ) : (
        <NoVideo className="streamcomponent"></NoVideo>
      )}
    </div>
  );
}

export default UserVideo;
