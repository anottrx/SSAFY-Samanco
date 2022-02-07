import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Router from "next/router";
import Layout from "../../components/Layout";
import * as boardActions from '../../store/module/board';

import { getArticleById, deleteBoard, registComment, updateArticleLike, fileDownload } from "../api/board";
import styled from "@emotion/styled";

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Card, Container, CardContent, Typography, Button, 
    Dialog, DialogActions, DialogTitle, ButtonGroup, TextField,
    Accordion, AccordionSummary, AccordionDetails, Chip } from "@mui/material";
import CommentList from "../../components/Board/CommentList"
import BoardColor from "../../data/BoardColor.json"

import forceReload from "../../util/ForceReload"
import Blob from 'cross-blob';

//게시글 상세보기 페이지

const BoardDetail = () => { 
    const detail = useSelector(({ board }) => board.boardDetail);
    const tag = detail.tag;
    const [like, changeLike] = useState(detail.userLike);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(like);

        getArticleById({
            boardId: detail.boardId,
            userId: sessionStorage.getItem("userId") == null? 
            0: sessionStorage.getItem("userId")
        })
        .then(res => {
            changeLike(res.board.userLike);
            dispatch(boardActions.setBoardDetail({detail: res.board}))
        });
    }, [like]);

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

    const CusH2 = styled(Chip)`
        margin-right: 10px;
        font-size: 15px;
        padding: 5px 0px;
        ${({colorinfo}) => colorinfo && `background-color: #${colorinfo}`}
    `
    
    return (
    <Layout>
        <CusContainer maxWidth="md">
            <br></br>
            <DetailHeader>
                <CusH2 
                    colorinfo={BoardColor[tag].color}
                    label={BoardColor[tag].label} />
                {
                    sessionStorage.getItem("userId") && sessionStorage.getItem("userId") == detail.userId?
                    <DetailOperation />
                    : null
                }
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
                    Router.push("/board/update");
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
                <Button onClick={() => {
                    JoinDialogClose();
                    deleteBoard({
                        boardId: detail.boardId,
                        userId: sessionStorage.getItem("userId")
                    }).then(res => {
                        if (res.statusCode === 200) {
                            alert("게시물이 삭제되었습니다.")
                            Router.push("/board")
                        } else {
                            alert(`${res.message}`)
                        }
                    })
                }} autoFocus>
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

            & .dateOrTime{
                color: gray;
            }
        `
        function changeToBlob(file){
            fileDownload(file)
            .then(res => {
                console.log(res)
                // console.log(new Blob([res], { type: res.headers['content-type'] }))
                
                // let fileURL = URL.createObjectURL(new Blob([{res}], { type: res.headers['content-type'] }))
                // let fileURL = window.URL.createObjectURL(res.data)
                let fileURL=res.data
                // const fileURL = window.URL.createObjectURL(new Blob([res]))
                let fileLink = document.createElement("a")
                fileLink.href = fileURL
                fileLink.setAttribute("download", file.originFile)
                document.body.appendChild(fileLink)
                fileLink.click()
                fileLink.remove()
                console.log(fileURL)
                console.log(fileLink)
            })
        }

        return (
            detail?
            <>
            <CusCard>
                <CardContent>
                    <DetailWrapper>
                        <h4>{detail.title}</h4>
                        <div>
                            <p>{detail.nickname}</p>
                            <p className="dateOrTime">{detail.dateOrTime}</p>
                        </div>
                    </DetailWrapper>
                    <Typography sx={{ fontSize: 15 }}>
                    {
                        detail.content.split('\n').map((line, index) => {
                            return (<span key={index}>{line}<br/></span>)
                        })
                    }
                    </Typography>
                    <DetailAction detail={detail}></DetailAction>
                </CardContent>
            </CusCard>
            {
                Array.isArray(detail.files) && detail.files.length !== 0?
                    <CusCard>
                        <Accordion elevation="0">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            ><div>첨부 파일 ({`${detail.files.length}`})</div>
                            </AccordionSummary>
                        <AccordionDetails>
                        {
                        detail.files.map((file, index) => {
                            let path=file.saveFolder+"&"+file.saveFile;
                            return (
                                <div key={index} onClick={()=>{changeToBlob(file)}}><AttachFileIcon />{`${file.originFile}`}</div>
                                // <div key={index}><img src="http://localhost:3000/download/{path}"/></div>
                            )
                        })
                        }
                        </AccordionDetails>
                        </Accordion>
                    </CusCard>
                    :
                    null
                }
            <CusCard>
                <CardContent>
                <h4>댓글</h4>
                <CommentRegist/>
                {
                    detail && detail.comments && detail.comments.length!==0 ?
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
                    <Button onClick={() => {
                        if (sessionStorage.getItem("userId")) {
                            changeLike(!like);
                            updateArticleLike({
                                tag: "BOARD",
                                boardId: detail.boardId, 
                                userId: sessionStorage.getItem("userId")
                            }).then(res => {let mute = res})
                        } else {
                            alert("로그인이 필요한 작업입니다.");
                            Router.push("/login")
                        }
                    }} variant={like? "contained":"outlined"}>
                        {
                            like?
                            <FavoriteIcon /> 
                            :
                            <FavoriteBorderIcon /> 
                        }
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

        function registRequest() {
            registComment({
                boardId: detail.boardId,
                content: inputComment.content,
                userId: sessionStorage.getItem("userId")
            }).then(res => {
                if (res.statusCode === 200) {
                    // 현재 페이지 재로딩
                    forceReload();
                } else {
                    alert(`${res.message}`)
                }
            })
        }

        return(
            <CommentWrapper>
                {
                    sessionStorage.getItem("userId")? 
                    <>
                    <TextField 
                        id="outlined-basic"
                        placeholder="댓글을 입력하세요" 
                        variant="outlined" 
                        onChange={(e) => changeHandle(e.target.value, "content")}
                        onKeyPress= {(e) => {
                            if (e.key === 'Enter') {
                                registRequest();
                            }
                        }}
                        sx={{ width: "100%"}}>
                    </TextField>
                    <Button
                        sx={{ p: '10px 10px'}}
                        onClick={registRequest}
                        ><SendIcon sx={{ fontSize: 25 }}/>
                    </Button>
                    </>
                    :
                    <>
                    <TextField disabled defaultValue="회원만 댓글을 작성할 수 있습니다." sx={{ width: "100%"}}></TextField>
                    <Button
                        disabled
                        sx={{ p: '10px 10px'}}
                        ><SendIcon sx={{ fontSize: 25 }}/>
                    </Button>
                    </>
                }
                
                
            </CommentWrapper>
        )
    }
} 


export default BoardDetail;