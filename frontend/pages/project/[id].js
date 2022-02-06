import Layout from "../../components/Layout";
import { useSelector, useDispatch } from 'react-redux';

import styled from "@emotion/styled";
import StackList from "../../components/Club/StackList"
import PositionList from "../../components/Club/PositionList"

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { Card, Container, Skeleton, CardContent, Typography, 
    Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle, ButtonGroup, FormControl, RadioGroup,
    Radio, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import Router from "next/router";

import * as projectActions from '../../store/module/project';
import { deleteAPI, updateProjectLike, joinProjectAPI, 
    getProjectById, joinCancelProject, getUserAtProject, 
    changeProjectHost, quitProject } from "../api/project";

import forceReload from "../../util/ForceReload";

const ProjectDetail = () => { 
    const detail = useSelector(({ project }) => project.projectDetail);
    const userData = useSelector(({ project }) => project.userList);
    const [like, changeLike] = useState(detail.userLike);
    let blob, imageUrl;

    const dispatch = useDispatch();

    useEffect(() => {
        getUserAtProject({
            projectId: detail.id,
            userId: sessionStorage.getItem("userId")
        })
        .then(res => { 
            dispatch(projectActions.setUserList({list: res.users}))
        })
        .catch(err => console.log(err));

        getProjectById({
            projectId: detail.id, 
            userId: sessionStorage.getItem("userId") == null? 
                0: sessionStorage.getItem("userId")
        })
        .then(res => {
            dispatch(projectActions.setProjectDetail({detail: res.project}));

            // blob = new Blob([new ArrayBuffer(detail.file.imageByteArr)], { type: "image/png" })
            // imageUrl = URL.createObjectURL(blob);

            // console.log(blob);
            // console.log(detail.file.imageByteArr);
        });
    }, [like]);

    const DetailWrapper = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    `

    const ImageWrapper = styled.div`
        margin-right: 30px;
        margin-bottom: 10px;
    `

    const ContentWrapper = styled.div`
        display: flex;
        flex-direction: column;
        flex: 1;
    `

    const CusSkeleton = styled(Skeleton)`
        min-width: 300px;
        min-height: 200px;
        height: auto;
        width: 100%;
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
    
    const EndImage = styled.img`
        width: 80px;
        height: 80px;
        float: left;
        margin-right: auto;
        transform: translate(20%, 20%);
    `
    
    return (
    <Layout>
        <CusContainer maxWidth="md">
            <br></br>
            <DetailHeader>
                <h2>{detail.title}</h2>
                <DetailOperation detail={detail}></DetailOperation>
            </DetailHeader>
            <DetailWrapper maxWidth="sm">
                {
                    detail.collectStatus === "ING"? 
                    <ImageWrapper>
                    <img src={imageUrl} width={200} height={200}></img>
                    {/* <CusSkeleton variant="rectangular" animation={false} /> */}
                    </ImageWrapper>
                    :
                    <ImageWrapper>
                    <EndImage src="/images/apply_end.png"></EndImage>
                    <CusSkeleton variant="rectangular" animation={false} />
                    </ImageWrapper>
                }
                <ProjectInfo detail={detail}></ProjectInfo>
            </DetailWrapper>   
            <ProjectDetail></ProjectDetail>
            </CusContainer>
    </Layout>);

function DetailOperation({detail}) {
    const [openQuit, setOpenQuit] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);

    const QuitDialogOpen = () => { 
        if (sessionStorage.getItem("userId"))
            setOpenQuit(true) 
        else {
            alert("로그인이 필요한 작업입니다.")
            Router.push("/login")
        }
    }
    const QuitDialogClose = () => { setOpenQuit(false) }

    const UserDialogOpen = () => {setOpenUsers(true)}
    const UserDialogClose = () => {setOpenUsers(false)}
    
    const [hostAssign, setHostAssign] = useState(null);
    const [nextHost, setNextHost] = useState(null);

    return (
        <>
        <ButtonGroup variant="outlined">
            {
                sessionStorage.getItem("userId") == detail.hostId?
                <Button onClick={() => {
                    Router.push("/project/update");
                }}>수정</Button>
                : null
            } 
            {
                detail.projectJoinStatus === "OK"? 
                <Button onClick={QuitDialogOpen}>탈퇴</Button>
                :
                null
            }
        </ButtonGroup>

        <Dialog
            open={openUsers}
            onClose={UserDialogClose}>
            <DialogTitle>
                {"방장 권한을 넘길 유저를 선택해주세요."}
            </DialogTitle>
            <DialogContent>
                <FormControl> 
                    <RadioGroup
                        name="newHost"
                        onChange={(e) => {
                            e.persist();
                            setNextHost(e.target.value)
                        }}>
                        {
                            userData? 
                            userData.map(user => {
                                return (
                                    user.id!==detail.hostId?
                                    <FormControlLabel value={user.id+","+user.projectPosition}
                                        control={<Radio />} label={user.nickname} /> : null
                                )
                            }): null
                        }
                        
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={UserDialogClose}>취소</Button>
                <Button onClick={() => {
                    let [newHostId, newHostPosition] = nextHost.split(",");
                    changeProjectHost({
                        projectId: detail.id,
                        oldHostId: detail.hostId,
                        newHostId: newHostId,
                        newHostPosition: newHostPosition
                    }).then(res => {
                        if (res.statusCode == 200) {
                            alert("방장이 변경되었습니다.")
                            quitProject({
                                userId: detail.hostId,
                                projectId: detail.id
                            });
                            Router.push("/project");
                        } else (
                            alert(`${res.message}`)
                        )
                        // 페이지 새로고침
                    })
                }}>확인</Button>
            </DialogActions>
        </Dialog>

        {/* 탈퇴 다이얼로그 */}
        <Dialog
            open={openQuit}
            onClose={QuitDialogClose}
            >
            <DialogTitle>
                {"프로젝트를 탈퇴 하시겠습니까?"}
            </DialogTitle>
            <DialogContent>
            {
                // 방장일 경우 방장 넘기기
                sessionStorage.getItem("userId") == detail.hostId?
                
                <DialogContentText>
                프로젝트를 삭제하거나 방장 권한을 넘길 수 있습니다.<br></br>
                    <FormControl> 
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={hostAssign}
                            onChange={(e) => {setHostAssign(e.target.value)}}
                        >
                            <FormControlLabel value="quit"
                                            control={<Radio />} label="방장 권한 넘기기" />
                            <FormControlLabel value="delete" 
                                            control={<Radio />} label="프로젝트 삭제" />
                        </RadioGroup>
                    </FormControl>

                </DialogContentText>: null
            }
            </DialogContent>
            <DialogActions>
            <Button onClick={QuitDialogClose}>취소</Button>
            <Button onClick={() => {
                QuitDialogClose();
                // 방장일 때
                if (sessionStorage.getItem("userId") == detail.hostId) {
                    if (hostAssign === null) {
                        alert("프로젝트 삭제 또는 방장 권한 넘기기를 선택해주세요.")
                    }
                    else if (hostAssign === "quit") {
                        if (detail.positions[9].size == 1) {
                            alert("팀원이 존재하지 않습니다.")
                        } else
                            UserDialogOpen();
                        // 방장 권한 넘기기
                    } else if (hostAssign === "delete") {
                        deleteAPI({
                            id: detail.id,
                            hostId: sessionStorage.getItem("userId")
                        }).then(res => {
                            if (res.statusCode === 200) {
                                alert("프로젝트가 삭제 되었습니다.");
                                Router.push("/project")
                            } else {
                                alert(`${res.message}`)
                            }
                        })
                        // 프로젝트 삭제
                    }
                } else {
                    // 방장이 아닐 때
                    quitProject({
                        userId: sessionStorage.getItem("userId"),
                        projectId: detail.id
                    }).then(res => {
                        if (res.statusCode === 200) {
                            alert("프로젝트가 탈퇴 되었습니다.")
                            Router.push("/project")
                        } else {
                            alert(`${res.message}`)
                        }
                    })
                }
            }} autoFocus>
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
        
        const [selectPosition, setSelectPosition] = useState(null);
        let positions = {};
        
        useEffect(() => {
            detail.positions.map(pos => {
                if (!pos.position.includes("size"))
                    positions[pos.position] = pos.size;
            });
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
                            changeLike(!like);
                            updateProjectLike({
                                tag: "PROJECT",
                                projectId: detail.id, // 프로젝트 아이디
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
                <>
                <div>
                    {
                        // 글 작성한 사람 === 현재 로그인 한 사람 => 지원자 목록
                        sessionStorage.getItem("userId") == detail.hostId?
                        <Button variant="outlined" onClick={() => {Router.push("/project/applylist")}}>
                            지원자 목록 조회
                        </Button>
                        : 
                        null
                    } 
                    {
                        // 모집중 일때, 지원을 안했거나, 취소한 상태이면 지원하기 버튼 표시
                        detail.collectStatus === "ING" && detail.projectJoinStatus == null || detail.projectJoinStatus == "CANCEL"?
                        <Button variant="outlined" onClick={JoinDialogOpen}>지원하기</Button> : null
                    }
                    {
                        // 지원한 상태이면 지원 취소 표시
                        detail.collectStatus === "ING" && detail.projectJoinStatus == "BEFORE"?
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
                        원하는 포지션을 선택해주세요.<br></br>
                            <FormControl> 
                                <RadioGroup
                                    name="position"
                                    value={selectPosition}
                                    onChange={(e) => {
                                        e.persist();
                                        setSelectPosition(e.target.value)
                                    }}>
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
                            // 지원 취소 api
                            joinCancelProject({
                                projectId: detail.id,
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


export default ProjectDetail;