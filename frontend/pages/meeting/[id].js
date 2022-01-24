import styled from "@emotion/styled"

import User from "../../components/Meeting/User"
import RoomInfo from "../../components/Meeting/RoomInfo"
import Chatting from "../../components/Meeting/Chatting"

function meetingDetail() {
    const RoomWrapper = styled.div`
        margin: 10px;
    `

    const RoomContent = styled.div`
        display: grid;
        grid-template-columns: 3fr 1fr;
    `

    return (
        <RoomWrapper>
            <RoomInfo></RoomInfo>
            <RoomContent>
                <User></User>
                <Chatting></Chatting>
            </RoomContent>
        </RoomWrapper>        
    )
}

meetingDetail.getInitialProps = async (ctx) => {
    const pathname = ctx.pathname;
  
    return { pathname };
  };

export default meetingDetail