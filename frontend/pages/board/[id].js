import Layout from "../../components/layout";
import { useSelector, useDispatch } from 'react-redux';

import styled from "@emotion/styled";

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Card, Container, CardContent, Typography, Divider, Button, Dialog, DialogActions, DialogTitle, ButtonGroup, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import * as boardActions from '../../store/module/board';
import Router from "next/router";
import CommentList from "./CommentList"

import SendIcon from '@mui/icons-material/Send';
import { getArticleById } from "../api/board";

//게시글 상세보기 페이지

const BoardDetail = () => { 
    const detail = useSelector(({ board }) => board.boardDetail);
    console.log(detail)
    // const [like, changeLike] = useState(detail.likes);
    const [like, changeLike] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        getArticleById({
            boardId:detail.boardId,
            userId: sessionStorage.getItem("userId")
        })
        .then(res => {
            dispatch(boardActions.setBoardDetail({detail: res.board}))
        });
        console.log(detail)
    }, [like]);

    const CusContainer = styled(Container)`
        float: left
    `

    const DetailHeader = styled.div`
        display: flex;
        justify-content: flex-end;
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
            <BoardDetail></BoardDetail>
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

    function BoardDetail() {
        const CusCard = styled(Card)`
            margin-top: 10px;
            padding: 10px;

            & h4 {
                font-weight: bolder;
                padding: 0;
                margin: 0;
            }
        `
        
        const DetailWrapper = styled.div`
            display: flex;
            flex-direction: row;
            align-items: baseline;

            & > div {
                display: flex;
                margin-left: auto;
                float: right;
            }

            & div > p {
                margin-left: 10px;
            }
        `
        return (
            detail?
            <>
            <CusCard>
                <CardContent>
                    <DetailWrapper>
                        <h4>{detail.title}</h4>
                        <div>
                            <p>{detail.userId}</p>
                            <p>{detail.startDate}</p>
                        </div>
                    </DetailWrapper>
                    <Typography sx={{ fontSize: 15 }}>
                        {detail.content}
                    </Typography>
                    <DetailAction detail={detail}></DetailAction>
                </CardContent>
            </CusCard>
            <CusCard>
                <CardContent>
                <h4>댓글</h4>
                <CommentRegist/>
                {
                    detail?
                    <CommentList detail={detail}></CommentList>
                    :
                    <div>등록된 댓글이 없습니다.</div>
                }
                </CardContent>
            </CusCard>
            </>
            : null
        )
    }


    function DetailAction(props) {
        let detail = props.detail;
        const ActionWrapper = styled.div`
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 20px;
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
            margin: 10px 0px;
            align-items: center;
        `

        return(
            <CommentWrapper>
                <TextField 
                    id="outlined-basic"
                    placeholder="댓글을 입력하세요" 
                    variant="outlined" 
                    onChange={(e) => changeHandle(e.target.value, "content")}
                    sx={{ width: "100%"}}/>
                <Button
                    sx={{ p: '10px 10px'}}
                    onClick={() => {console.log(inputComment);}}
                ><SendIcon sx={{ fontSize: 25 }}/></Button>
            </CommentWrapper>
        )
    }
} 


export default BoardDetail;