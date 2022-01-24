import styled from "@emotion/styled"
import {TextField} from "@mui/material"

function Chatting() {

    const ChattingWrapper = styled.div`
        font: 13px Helvetica, Arial;
        min-width: 300px;
        min-height: calc(100% - 35px);
        border: 1px solid gray;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        padding: 10px;
        justify-content: space-between;
        overflow-y: scroll;
        
        .messages{
            padding: 5px;
        }

        & .otherMessageWrapper{
            text-align: left;
            margin-bottom: 15px;
        }

        & .otherMessage, .myMessage{
            border: 1px solid gray;
            border-radius: 5px;
            padding: 5px;
        }

        & .nickName{
            font-weight: bolder;
            margin-right: 10px;
        }

        & .myMessageWrapper{
            text-align: right;
            margin-bottom: 15px;
        }

    `

    return (
        <ChattingWrapper>
            <div className="messages">
                <div className="otherMessageWrapper">
                    <span className="nickName">닉네임</span>
                    <span className="otherMessage">안녕하세요</span>
                </div>
                <div className="otherMessageWrapper">
                    <span className="nickName">닉네임</span>
                    <span className="otherMessage">안녕하세요</span>
                </div>
                <div className="myMessageWrapper">
                    <span className="myMessage">안녕하세요</span>
                </div>
            </div>
            <TextField size="small"></TextField>
        </ChattingWrapper>
    )
}

export default Chatting