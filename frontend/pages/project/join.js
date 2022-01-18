import Layout from "../../components/layout";
import styled from "@emotion/styled";
import { Container } from "@mui/material";

function Join(){
    
    const CusContainer = styled(Container)`
        float: left
    `

    return (
        <Layout>
            <CusContainer  maxWidth="md">
                <br></br>
                <h2>프로젝트 지원</h2>
                
            </CusContainer>
        </Layout>
    )
}

export default Join;