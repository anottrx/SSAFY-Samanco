import {Card, CardContent, Button} from "@mui/material";
import styled from "@emotion/styled";

function MyClub(props){
    const MyClubWrapper = styled.div`
        width: 100%;
        & .img-wrapper{
            background-Color: #c9c9c9;
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }
    `

    const CusCardContent = styled(CardContent)`
        display: flex;
        flex-direction: row;
    `

    const ProjectInfo = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0px 10px;

        & .title {
            font-size: 18px;
        }
    `

    const CusCard = styled(Card)`
        max-width: 430px;
    `
    
    return (
        <MyClubWrapper>
            <h2>{props.label}</h2>
            <CusCard>
                <CusCardContent>
                    <div className="img-wrapper"></div>
                    <ProjectInfo>
                        <div className="title">프로젝트명</div>
                        <div>기한 ~ 기한</div>
                        
                        <div>스택들</div>
                        <Button variant="outlined">상세 보기 </Button>
                    </ProjectInfo>
                    
                </CusCardContent>
            </CusCard>
        </MyClubWrapper>
    )
}

export default MyClub;