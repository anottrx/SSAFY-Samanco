import styled from "@emotion/styled"
import { TextField } from "@mui/material"
import { useRef, useEffect } from "react"

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

    let index = [0, 0, 0, 0, 0, 0]
    const scrollEl = useRef(null);

    const scrollToBottom = () => {
        scrollEl.current?.scrollIntoView({
            // behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          })
      }

    useEffect(() => {
        scrollToBottom()
      }, []);


    return (
        <ChattingWrapper>
            <div className="messages" ref={scrollEl}>
                {
                    index.map(idx => {
                        return (
                            <>
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
                        </>
                        )
                    })
                }
            </div>
            <TextField size="small"></TextField>
        </ChattingWrapper>
    )
}

export default Chatting