import styled from '@emotion/styled';

import Users from '../../components/Meeting/User';
import RoomInfo from '../../components/Meeting/RoomInfo';
import Chatting from '../../components/Meeting/Chatting';
import { Card, Divider } from '@mui/material';

function meetingDetail() {
  const RoomWrapper = styled(Card)`
    padding: 20px;
    margin: 10px;
    height: calc(100vh - 20px);
    overflow-y: scroll;
  `;

  const RoomContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    height: calc(100% - 100px);
  `;

  return (
    <RoomWrapper>
      <RoomInfo></RoomInfo>
      <Divider />
      <RoomContent>
        <Users></Users>
        <Chatting></Chatting>
      </RoomContent>
    </RoomWrapper>
  );
}

meetingDetail.getInitialProps = async (ctx) => {
  const pathname = ctx.pathname;

  return { pathname };
};

export default meetingDetail;
