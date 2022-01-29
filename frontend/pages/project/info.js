import styled from "@emotion/styled";
import Layout from "../../components/layout";
import StackList from "../../components/Club/StackList"
import PositionList from "../../components/Club/PositionList"
import UserCard from "../../components/Common/UserCard";

import { useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { Container, Skeleton, Card, CardContent, Typography, Divider,
    ButtonGroup, Button, Dialog, DialogTitle, DialogContent, 
    DialogContentText, FormControl, RadioGroup,FormControlLabel, 
    Radio, DialogActions} from "@mui/material"

import { getUserAtProject } from "../../pages/api/project"
import * as projectActions from '../../store/module/project';


function ProjectInfo(){
    let clubData = useSelector(({ project }) => project.myProject);
    const userData = useSelector(({ project }) => project.userList);
    const dispatch = useDispatch();
   
    useLayoutEffect(() => {
        getUserAtProject({
            projectId: clubData.id,
            userId: sessionStorage.getItem("userId")
        })
        .then(res => { 
            dispatch(projectActions.setUserList({list: res.users}))
        })
        .catch(err => console.log(err))
    }, []);

    const CusContainer = styled(Container)`
        float: left;
        margin-bottom: 50px;
    `

   const ContentWrapper = styled.div`
        display: flex;
        flex-direction: column;
        padding: 0px 30px;
        flex: 1;
    `

    const DetailWrapper = styled.div`
        display: flex;
        flex-direction: row;
    `

    const CusSkeleton = styled(Skeleton)`
        display: flex;
        flex: 1;
        min-width: 200px;
        min-height: 200px;
        height: auto;
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
                    <DetailOperation detail={clubData}></DetailOperation>
                </DetailHeader>
                <h2>{clubData.title}</h2>
                <DetailWrapper maxWidth="sm">
                    <CusSkeleton variant="rectangular" animation={false} />
                    <ProjectInfo detail={clubData}></ProjectInfo>
                </DetailWrapper> 
                <ProjectDetail></ProjectDetail>
            </CusContainer>
        </Layout>
    )

    function DetailOperation({detail}) {
        const [open, setOpen] = useState(false);
    
        const QuitDialogOpen = () => { 
            if (sessionStorage.getItem("userId"))
                setOpen(true) 
            else {
                alert("로그인이 필요한 작업입니다.")
                Router.push("/login")
            }
        }
        const QuitDialogClose = () => { setOpen(false) }
        
        const [hostAssign, setHostAssign] = useState(null);


        return (
            <>
            <ButtonGroup variant="outlined">
                {
                    sessionStorage.getItem("userId") == clubData.hostId?
                    <Button onClick={() => {
                        Router.push("/project/update");
                    }}>수정</Button>
                    : null
                } 
                <Button onClick={QuitDialogOpen}>탈퇴</Button>
            </ButtonGroup>
            <Dialog
                open={open}
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
                                <FormControlLabel value="delete" 
                                                control={<Radio />} label="프로젝트 삭제" />
                                <FormControlLabel value="leave"
                                                control={<Radio />} label="방장 권한 넘기기" />
                            </RadioGroup>
                        </FormControl>

                    </DialogContentText>: null
                }
                </DialogContent>
                <DialogActions>
                <Button onClick={QuitDialogClose}>취소</Button>
                <Button onClick={() => {
                    QuitDialogClose();

                    if (hostAssign!== null) {
                        if (hostAssign === "leave") {
                            // 방장 권한 넘기기
                        } else if (hostAssign === "delete") {
                            // 프로젝트 삭제
                        }
                    }
                    // joinProjectAPI({
                    //     position: selectPosition,
                    //     projectId: detail.id,
                    //     userId: sessionStorage.getItem("userId")
                    // })
                    // .then(res => {
                    //     if (res.statusCode === 200) {
                    //         alert("프로젝트 지원 신청이 되었습니다.")
                    //     } else {
                    //         alert(`${res.message}`)
                    //     }
                    // })
                    // .catch(err => console.log(err));
                }} autoFocus>
                    확인
                </Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }

    function ProjectInfo(){
        const DateWrapper = styled.div`
            display: flex;
            flex-direction: row;
            & > div {
                display: flex;
                flex-direction: column;
                flex: 1;
            }
        `

        const RowWrapper = styled.div`
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            & > div {
                padding-bottom: 20px;
            }
        `

        return (
            <ContentWrapper>
                <div>기술 스택</div>
                <StackList stackData={clubData.stacks}></StackList>
                <br />
                <RowWrapper>
                    <div>
                        <div>현재 팀원</div>
                        <PositionList positionData={clubData.positions}></PositionList>  
                    </div>
                    <DateWrapper>
                        <div>
                            <div>진행 기간</div>
                            <Typography>
                                {clubData.startDate} ~  {clubData.endDate}
                            </Typography>
                        </div>
                    </DateWrapper>    
                </RowWrapper>  
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
                        clubData.description.split('\n').map((line, index) => {
                            return (<span key={index}>{line}<br/></span>)
                        })
                    }
                    </Typography>
                    <br />
                    <Divider light />
                    <br />
                    <ProjectUser detail={clubData}></ProjectUser>
                    <br />
                </CardContent>
            </CusCard>
        )

        function ProjectUser(props) {
            const UserWrapper = styled.div`
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            & > div {
                display: flex;
                flex-direction: column;
                flex: 1;
                margin: 10px;
            }
            & .no-user{
                font-size: 14px;
            }
        `

            return (
                <UserWrapper>
                    <div>
                        <div>팀장</div>
                        <div>
                        {
                            userData == null?
                            <div className="no-user">아직 팀원이 없어요 ㅠ.ㅠ</div>:
                            userData.map(user => {
                                return (
                                    <UserCard 
                                    key={user.id} 
                                    user={user}
                                    ></UserCard>
                                )
                            })
                        }
                        </div>
                    </div>
                    <div>
                        <div>팀원</div>
                        <div>
                        {
                            userData == null?
                            <div className="no-user">아직 팀원이 없어요 ㅠ.ㅠ</div>:
                            userData.map(user => {
                                return (
                                    <UserCard 
                                    key={user.id} 
                                    user={user} 
                                    projectId={clubData.id}
                                    hostId={clubData.hostId}></UserCard>
                                )
                            })
                        }
                        </div>
                    </div>
                </UserWrapper>
            )
        }
    }
}



export default ProjectInfo