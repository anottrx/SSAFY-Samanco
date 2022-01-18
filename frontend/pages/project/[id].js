import Layout from "../../components/layout";
import { useRouter } from 'next/router' 
import { useSelector } from 'react-redux';

import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';

import styled from "@emotion/styled";

const ProjectDetail = () => { 
    const detail = useSelector(({ project }) => project.projectDetail);
    const DetailWrapper = styled.div`
        display: flex;
        flex-direction: row;
    `

    const ContentWrapper = styled.div`
        display: flex;
        flex-direction: column;
        padding: 0px 10px;
    `

    const StackChip = styled(Chip)`
        margin-right: 10px;
    `

    return (
    <Layout>
        <br></br>
        <h2>{detail.title}</h2>
        <DetailWrapper>
            <Skeleton variant="rectangular" height={150} width={150} animation={false} />
            <DetailContent detail={detail}></DetailContent>
        </DetailWrapper>    
        <p>{detail.description}</p>
    </Layout>);

    function DetailContent(){
        return (
            <ContentWrapper>
                <div>기술 스택</div>
                <div>
                    <StackChip label="Vue" />
                    <StackChip label="Spring Boot"/>
                    <StackChip label="MySQL"/>
                </div>
                <br />
                <div>모집 팀원</div>
                <div>
                    FrontEnd <StackChip label="3 / 3" size="small"/><br />
                    BackEnd <StackChip label="2 / 3" size="small"/>
                </div>
            </ContentWrapper>
        )
    }
} 


export default ProjectDetail;