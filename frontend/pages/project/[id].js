import Layout from "../../components/layout";
import { useSelector } from 'react-redux';

import styled from "@emotion/styled";
import StackList from "../../components/Club/StackList"
import PositionList from "../../components/Club/PositionList"

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Card, Container, Skeleton, CardContent, Typography, 
    Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle, ButtonGroup, FormControl, FormLabel, RadioGroup,
    Radio, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import Router from "next/router";

import { deleteAPI, updateProjectLike, joinProjectAPI } from "../api/project";

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
                    <DetailOperation detail={detail}></DetailOperation>: null
                } 
            </DetailHeader>
            <DetailWrapper maxWidth="sm">
                <CusSkeleton variant="rectangular" animation={false} />
                <ProjectInfo detail={detail}></ProjectInfo>
            </DetailWrapper>   
            <ProjectDetail></ProjectDetail>
            </CusContainer>
    </Layout>);

    function DetailOperation({detail}) {
        const [open, setOpen] = useState(false);

        const deleteDialogOpen = () => { setOpen(true) }
        const deleteOperation = () => {
            let data = {id: detail.id, hostId: parseInt(sessionStorage.getItem("userId"))};
            deleteAPI(data)
            .then(res => {
                if (res.statusCode == 200){
                    console.log("삭제");
                    Router.push("/project")
                }
            })
            .catch(err => console.log(err))
            setOpen(false);
        }
        const deleteDialogClose = () => { setOpen(false) }


        return (
            <>
            <ButtonGroup variant="outlined">
                <Button onClick={() => {
                    Router.push("/project/update");
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

    function ProjectInfo(){
        return (
            <ContentWrapper>
                <div>기술 스택</div>
                <StackList stackData={detail.stacks}></StackList>
                <br />
                <div>모집 팀원</div>
                <PositionList positionData={detail.positions}></PositionList>        
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
                        진행 기간
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} >
                        {detail.startDate} ~  {detail.endDate}
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

        const JoinDialogOpen = () => { 
            if (sessionStorage.getItem("userId"))
                setOpen(true) 
            else {
                alert("로그인이 필요한 작업입니다.")
                Router.push("/login")
            }
        }
        const JoinDialogClose = () => { setOpen(false) }
        
        const [selectPosition, setSelectPosition] = useState("");

        let positions = {};
        
        useEffect(() => {
            detail.positions.map(pos => {
                if (!pos.position.includes("size"))
                    positions[pos.position] = pos.size;
            })
            console.log(positions)
        },[])

        return (
            <ActionWrapper>
                <ButtonGroup variant="outlined" aria-label="text button group">
                    <Button  style={{ pointerEvents: "none" }}> 
                        <VisibilityIcon /> 
                        <span>{detail.hit}</span>
                    </Button>
                    <Button onClick={() => {
                        if (sessionStorage.getItem("userId")) {
                            // To do: 좋아요 api 호출
                            console.log("좋아요");
                            updateProjectLike(detail.id).then(res => console.log(res))
                        } else {
                            alert("로그인이 필요한 작업입니다.");
                            Router.push("/login")
                        }
                    }}>
                        <FavoriteIcon /> 
                        <span>{detail.likes}</span>
                    </Button>
                </ButtonGroup>
                <>
                <div>
                    {
                        // 글 작성한 사람 === 현재 로그인 한 사람 => 지원자 목록
                        sessionStorage.getItem("userId") == detail.hostId?
                        <Button variant="outlined" onClick={() => {Router.push("/project/applylist")}}>
                            지원자 목록 조회
                        </Button>
                        : 
                        // 글 작성한 사람 !=== 현재 로그인 한 사람 => 지원하기 버튼
                        <Button variant="outlined" onClick={JoinDialogOpen}>지원하기</Button>
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
                        원하는 포지션을 선택해주세요.<br></br>
                            <FormControl> 
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={selectPosition}
                                    onChange={(e) => {setSelectPosition(e.target.value)}}
                                >
                                    {
                                        detail.positions.map((data, index) => {
                                            let name = data.position.split("total")[1] || data.position.split("current")[1];

                                            positions[data.position] = data.size;
                                            return (
                                                data.position.includes("current") && data.position!=="currentSize"
                                                && positions["total"+name] > 0 && positions["total"+name] > positions["current"+name]?
                                                <FormControlLabel 
                                                    key={index} value={name} 
                                                    control={<Radio />} label={name} />
                                                :
                                                null
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </FormControl>

                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={JoinDialogClose}>취소</Button>
                        <Button onClick={() => {
                            JoinDialogClose();
                            joinProjectAPI({
                                position: selectPosition,
                                projectId: detail.id,
                                userId: sessionStorage.getItem("userId")
                            })
                            .then(res => {
                                if (res.statusCode === 200) {
                                    alert("프로젝트 지원 신청이 되었습니다.")
                                } else {
                                    alert(`${res.message}`)
                                }
                            })
                            .catch(err => console.log(err));
                        }} autoFocus>
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