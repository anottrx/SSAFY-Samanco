import Layout from "../../components/layout";
import { useSelector, useDispatch } from 'react-redux';

import styled from "@emotion/styled";
import StackList from "../../components/Club/StackList"

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { Card, Container, Skeleton, CardContent, Typography, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";
import Router from "next/router";

import * as studyActions from '../../store/module/study';
import { deleteAPI, updateStudyLike, joinStudyAPI, getStudyById, joinCancelStudy } from "../api/study";

import { forceReload } from "../../util/ForceReload";

const StudyDetail = () => { 
    const detail = useSelector(({ study }) => study.studyDetail);
    const [like, changeLike] = useState(detail.userLike);

    const dispatch = useDispatch();

    useEffect(() => {
        getStudyById({
            studyId: detail.id, 
            userId: sessionStorage.getItem("userId") == null? 
                0: sessionStorage.getItem("userId")
        })
        .then(res => {
            dispatch(studyActions.setStudyDetail({detail: res.study}))
    });
    }, [like]);

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
                <h2>{detail.title}</h2>
                {
                    sessionStorage.getItem("userId") == detail.hostId?
                    <DetailOperation></DetailOperation> : null
                }
            </DetailHeader>
            <DetailWrapper maxWidth="sm">
                <CusSkeleton variant="rectangular" animation={false} />
                <StudyInfo detail={detail}></StudyInfo>
            </DetailWrapper>    
            <StudyDetail></StudyDetail>
        </CusContainer>
    </Layout>);

    function DetailOperation() {
        const [open, setOpen] = useState(false);

        const deleteDialogOpen = () => { setOpen(true) }
        const deleteOperation = () => {
            let data = {id: detail.id, hostId: parseInt(sessionStorage.getItem("userId"))};
            console.log(data)
            deleteAPI(data)
            .then(res => {
                if (res.statusCode == 200){
                    console.log("삭제")
                    Router.push("/study")
                }
                else
                    alert(`${res.message}`)
            })
            .catch(err => console.log(err))
            setOpen(false);
        }
        const deleteDialogClose = () => { setOpen(false) }


        return (
            <>
            <ButtonGroup variant="outlined">
                <Button onClick={() => {
                    Router.push("/study/update");
                }}>수정</Button>
                <Button onClick={deleteDialogOpen}>삭제</Button>
            </ButtonGroup>
            <Dialog
                open={open}
                onClose={deleteDialogClose}
                >
                <DialogTitle>
                    {"삭제 하시겠습니까?"}
                </DialogTitle>
                <DialogActions>
                <Button onClick={deleteDialogClose}>취소</Button>
                <Button onClick={deleteOperation} autoFocus>
                    확인
                </Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }

    function StudyInfo(){
        
        return (
            <ContentWrapper>
                <div>스터디 주제</div>
                <StackList stackData={detail.stacks}></StackList>
                <br />
        
            </ContentWrapper>
        )
    }

    function StudyDetail() {
        const CusCard = styled(Card)`
            margin-top: 10px;
        `

        return (
            <CusCard sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 16 }}  variant="body1">
                    {
                        detail.description.split('\n').map((line, index) => {
                            return (<span key={index}>{line}<br/></span>)
                        })
                    }
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
                text-align: center;
            }

            & span {
                margin : 0px 5px;
            }
        `
        const [open, setOpen] = useState(false);
        const [joinCancel,setJoinCalcel] = useState(false);

        const JoinDialogOpen = () => { 
            if (sessionStorage.getItem("userId"))
            setOpen(true) 
            else {
                alert("로그인이 필요한 작업입니다.")
                Router.push("/login")
            }
        }
        const JoinDialogClose = () => { setOpen(false) }

        const JoinCancelDialogOpen = () => {setJoinCalcel(true)}
        const JoinCancelDialogClose = () => {setJoinCalcel(false)}

        return (
            <ActionWrapper>
                <ButtonGroup variant="outlined" aria-label="text button group">
                    <Button  style={{ pointerEvents: "none" }}> 
                        <VisibilityIcon /> 
                        <span>{detail.hit}</span>
                    </Button>
                    <Button onClick={() => {
                        changeLike(!like);
                        if (sessionStorage.getItem("userId")) {
                            updateStudyLike({
                                tag: "STUDY",
                                studyId: detail.id, // 스터디 아이디
                                userId: sessionStorage.getItem("userId")
                            }).then(res => console.log(res))
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
                <>
                <div>
                    {
                        // 글 작성한 사람 === 현재 로그인 한 사람 => 지원자 목록
                        sessionStorage.getItem("userId") == detail.hostId?
                        <Button variant="outlined" onClick={() => {Router.push("/study/applylist")}}>
                            지원자 목록 조회
                        </Button>
                        : 
                        null
                    } 
                    {
                        detail.studyJoinStatus == null || detail.studyJoinStatus == "CANCEL "?
                        <Button variant="outlined" onClick={JoinDialogOpen}>지원하기</Button> : null
                    }
                    {
                        detail.studyJoinStatus == "BEFORE"?
                        <Button variant="outlined" onClick={JoinCancelDialogOpen}>지원취소</Button> : null
                    }
                </div>
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
                        <Button onClick={() => {
                            JoinDialogClose();
                            joinStudyAPI({
                                studyId: detail.id,
                                userId: sessionStorage.getItem("userId")
                            })
                            .then(res => {
                                if (res.statusCode === 200) {
                                    alert("스터디 지원 신청이 되었습니다.")
                                } else {
                                    alert(`${res.message}`)
                                }
                            })
                            .catch(err => console.log(err));
                            forceReload();
                        }} autoFocus>
                            확인
                        </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={joinCancel}
                        onClose={JoinCancelDialogClose}
                        >
                        <DialogTitle>
                            {"지원 취소 하시겠습니까?"}
                        </DialogTitle>
                        <DialogContent>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={JoinCancelDialogClose}>아니요</Button>
                        <Button onClick={() => {
                            JoinCancelDialogClose();
                            joinCancelStudy({
                                studyId: detail.id,
                                userId: sessionStorage.getItem("userId")
                            })
                            .then(res => {
                                if (res.statusCode === 200) {
                                    alert("프로젝트 지원 취소가 되었습니다.")
                                } else {
                                    alert(`${res.message}`)
                                }
                            })
                            .catch(err => console.log(err));
                            forceReload();
                        }} autoFocus>
                            예
                        </Button>
                        </DialogActions>
                    </Dialog>
                </>
            </ActionWrapper>
        )
    }
} 


export default StudyDetail;