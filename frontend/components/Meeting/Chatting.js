import styled from "@emotion/styled"

function Chatting() {

    const ChattingWrapper = styled.div`
        font: 13px Helvetica, Arial;
        background-color: gray;
        min-width: 300px;
        height: 100vh
        overflow-y: scroll;
`

    return (
        <ChattingWrapper>
            채팅~
        </ChattingWrapper>
    )
}

export default Chatting