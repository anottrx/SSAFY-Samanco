import OpenViduVideoComponent from './OvVideo';

function UserVideo({ streamManager }) {
  // console.log('-------------user', streamManager);
  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
        </div>
      ) : null}
    </div>
  );
}

export default UserVideo;
