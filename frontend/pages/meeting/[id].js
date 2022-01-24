import styled from "@emotion/styled"

import User from "../../components/Meeting/User"
import RoomInfo from "../../components/Meeting/RoomInfo"
import Chatting from "../../components/Meeting/Chatting"
import {Card, Divider} from "@mui/material"

function meetingDetail() {
    const RoomWrapper = styled(Card)`
        padding: 20px;
        margin: 10px;
    `

    const RoomContent = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 20px;
    `

    return (
        <RoomWrapper>
            <RoomInfo></RoomInfo>
            <Divider />
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