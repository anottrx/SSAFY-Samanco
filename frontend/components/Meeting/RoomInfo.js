import styled from "@emotion/styled"

function RoomInfo() {
    const InfoWrapper = styled.div`
        display:flex;
        flex-direction: row;    
        align-items: center;
        margin: 30px 0px 0px 0px;
        justify-content: space-between;
        
        & h2 {
            margin: 0;
        }
    `
    return (
        <InfoWrapper>
            <h2>방 제목</h2>
            <span>회의 시작 시간: 2022-01-24 11:00</span>
        </InfoWrapper>
    )
}

export default RoomInfo