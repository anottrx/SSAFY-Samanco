import Layout from "../../components/layout";
import { useSelector } from 'react-redux';

import styled from "@emotion/styled";
import StackList from "../../components/Project/StackList"
import stackData from "../../data/StackData.json"
import PositionList from "../../components/Project/PositionList"
import positionData from "../../data/positionData.json"

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Card, Container, Skeleton, CardContent, Typography, Divider } from "@mui/material";
import Link from "next/link";

const ProjectDetail = () => { 
    const detail = useSelector(({ project }) => project.projectDetail);

    const DetailWrapper = styled.div`
        display: flex;
        flex-direction: row;
    `

    const ContentWrapper = styled.div`
        display: flex;
        flex-direction: column;
        padding: 0px 30px;
        flex: 1;
    `

    const CusSkeleton = styled(Skeleton)`
        display: flex;
        flex: 1;
        min-width: 200px;
        min-height: 200px;
        height: auto;
    `

    const CusContainer = styled(Container)`
        float: left
    `
    
    return (
    <Layout>
        <CusContainer  maxWidth="md">
            <br></br>
            <h2>{detail.title}</h2>
            <DetailWrapper maxWidth="sm">
                <CusSkeleton variant="rectangular" animation={false} />
                <ProjectInfo detail={detail}></ProjectInfo>
            </DetailWrapper>    
            <ProjectDetail></ProjectDetail>
        </CusContainer>
    </Layout>);

    function ProjectInfo(){
        return (
            <ContentWrapper>
                <div>기술 스택</div>
                <StackList stackData={stackData}></StackList>
                <br />
                <div>모집 팀원</div>
                <PositionList positionData={positionData}></PositionList>        
            </ContentWrapper>
        )
    }

    function ProjectDetail() {
        const CusCard = styled(Card)`
            margin-top: 10px;
        `

        return (
            <CusCard sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 16 }}  variant="body1">
                        {detail.description}
                    </Typography>
                    <br />
                    <Divider light />
                    <br />
                    <DetailFooter detail={detail}></DetailFooter>
                </CardContent>
                <DetailAction detail={detail}></DetailAction>
            </CusCard>
        )
    }

    function DetailFooter(props) {
        const FooterWrapper = styled.div`
        display: flex;
        flex-direction: row;
        & > div {
            display: flex;
            flex-direction: column;
            flex: 1;
            margin: 10px;
        }
    `
        let detail = props.detail;

        return (
            <FooterWrapper>
                <div>
                    <Typography sx={{ fontSize: 14 }} gutterBottom>
                        진행 기간
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} >
                        {detail.start_date} ~  {detail.end_date}
                    </Typography>
                </div>
                <div>
                    <Typography sx={{ fontSize: 14 }} gutterBottom>
                        예정 스케쥴
                    </Typography>

                    <Typography sx={{ mb: 1.5 }}>
                        {detail.schedule} 
                    </Typography>
                </div>
            </FooterWrapper>
        )
    }

    function DetailAction(props) {
        let detail = props.detail;
        const ActionWrapper = styled.div`
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 20px;
            & > div, a {
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            & span {
                margin : 0px 10px 0px 5px;
            }
        `

        return (
            <ActionWrapper>
                <div>
                    <VisibilityIcon /> 
                    <span>{detail.hit}</span>
                    <FavoriteIcon /> 
                    <span>{detail.like}</span>
                </div>
                <>
                    <Link href="/project/join">지원하기</Link>
                </>
            </ActionWrapper>
        )
    }
} 


export default ProjectDetail;