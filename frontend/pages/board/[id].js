import Layout from "../../components/layout";
import { useSelector } from 'react-redux';

import styled from "@emotion/styled";

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Card, Container, Skeleton, CardContent, Typography, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ButtonGroup } from "@mui/material";
import { useState } from "react";
import Router from "next/router";


const ProjectDetail = () => { 
    const detail = useSelector(({ board }) => board.boardDetail);

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

    const DetailHeader = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px 0px; 
        & > h2 {
            margin: 0;
        }
        & > div {
            height: fit-content;
        }
    `
    
    return (
    <Layout>
        <CusContainer maxWidth="md">
            <br></br>
            <DetailHeader>
                <DetailOperation></DetailOperation>
            </DetailHeader>
            
            <ProjectDetail></ProjectDetail>
        </CusContainer>
    </Layout>);

    function DetailOperation() {
        const [open, setOpen] = useState(false);

        const JoinDialogOpen = () => { setOpen(true) }
        const JoinDialogClose = () => { setOpen(false) }


        return (
            <>
            <ButtonGroup variant="outlined">
                <Button onClick={() => {
                    Router.push("/project/update");
                }}>수정</Button>
                <Button onClick={JoinDialogOpen}>삭제</Button>
            </ButtonGroup>
            <Dialog
                open={open}
                onClose={JoinDialogClose}
                >
                <DialogTitle>
                    {"삭제 하시겠습니까?"}
                </DialogTitle>
                <DialogActions>
                <Button onClick={JoinDialogClose}>취소</Button>
                <Button onClick={JoinDialogClose} autoFocus>
                    확인
                </Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }

    function ProjectDetail() {
        const CusCard = styled(Card)`
            margin-top: 10px;
        `

        return (
            <CusCard sx={{ minWidth: 275 }}>
                <CardContent>
                    <h1>{detail.title}</h1>
                    <Typography sx={{ fontSize: 16 }}  variant="body1">
                        {detail.content}
                    </Typography>
                    <br />
                    <DetailAction detail={detail}></DetailAction>
                    <Divider light />
                    <br />
                </CardContent>
                
            </CusCard>
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
                text-align: center;
            }

            & span {
                margin : 0px 5px;
            }
        `
        const [open, setOpen] = useState(false);

        const JoinDialogOpen = () => { setOpen(true) }
        const JoinDialogClose = () => { setOpen(false) }

        return (
            <ActionWrapper>
                <ButtonGroup variant="outlined" aria-label="text button group">
                    <Button  style={{ pointerEvents: "none" }}> 
                        <VisibilityIcon /> 
                        <span>{detail.hit}</span>
                    </Button>
                    <Button>
                        <FavoriteIcon /> 
                        <span>{detail.likes}</span>
                    </Button>
                </ButtonGroup>
                <>
                    <Button variant="outlined">댓글달기</Button>
                    <Dialog
                        open={open}
                        onClose={JoinDialogClose}
                        >
                        <DialogTitle>
                            {"지원 하시겠습니까?"}
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            마이페이지에 기입된 정보가 전달됩니다. 
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={JoinDialogClose}>취소</Button>
                        <Button onClick={JoinDialogClose} autoFocus>
                            확인
                        </Button>
                        </DialogActions>
                    </Dialog>
                </>
            </ActionWrapper>
        )
    }
} 


export default ProjectDetail;