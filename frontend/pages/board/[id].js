import Layout from "../../components/layout";
import { useSelector } from 'react-redux';

import styled from "@emotion/styled";

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Card, Container, CardContent, Typography, Divider, Button, Dialog, DialogActions, DialogTitle, ButtonGroup, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect } from "react";
import Router from "next/router";
import CommentList from "./CommentList"

//게시글 상세보기 페이지

const ProjectDetail = () => { 
    const detail = useSelector(({ board }) => board.boardDetail);

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
                    Router.push("/board/BoardRegist");
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
        const DetailWrapper = styled.div`
            display: flex;
            flex-direction: row;
            padding: 10px;
            & > div {
                display: flex;
                margin-left: auto;
                float: right;
            }

            & div > p {
                margin-left: 10px;
            }
        `
        //게시글 제목(title),작성자 아이디(userId),작성날짜(startDate),내용(content)
        return (
            <CusCard sx={{ minWidth: 275 }}>
                <CardContent>
                    <DetailWrapper>
                        <h1>{detail.title}</h1>
                        <div>
                            <p>{detail.userId}</p>
                            <p>{detail.startDate}</p>
                        </div>
                    </DetailWrapper>
                    <Typography sx={{ fontSize: 18 }}>
                        {detail.content}
                    </Typography>
                    <br />
                    <DetailAction detail={detail}></DetailAction>
                    <Divider light />
                    <CommentList detail={detail}></CommentList>
                    <br />
                </CardContent>
                <CommentRegist/>
            </CusCard>
        )
    }


    function DetailAction(props) {
        let detail = props.detail;
        const ActionWrapper = styled.div`
            display: flex;
            float: right;
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
        //조회수,좋아요 
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
            </ActionWrapper>
        )
    }

    function CommentRegist(){
        const [inputComment, setInputComment] = useState({});

        const changeHandle = (value, name) => {
            inputComment[name] = value;
        }

        const CommentWrapper = styled.div`
            display: flex;
            border : 1px dashed gray;
            margin: 10px 10px 10px 10px;
        `

        return(
            <CommentWrapper>
                <TextField 
                    id="outlined-basic"
                    placeholder="댓글을 입력하세요" 
                    variant="outlined" 
                    onChange={(e) => changeHandle(e.target.value, "content")}
                    sx={{ width: "900px"}}/>
                <Button
                    sx={{ p: '10px 10px'}}
                    onClick={() => {console.log(inputComment);}}
                ><SendIcon sx={{ fontSize: 25 }}/></Button>
            </CommentWrapper>
        )
    }
} 


export default ProjectDetail;