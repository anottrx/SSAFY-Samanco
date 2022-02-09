import OpenViduVideoComponent from './OvVideo';

function UserVideo({ streamManager, name }) {
  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div>
            <p>{name}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UserVideo;
