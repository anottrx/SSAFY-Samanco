import styled from '@emotion/styled';
import Layout from '../../components/Layout';
import StackList from '../../components/Club/StackList';
import PositionList from '../../components/Club/PositionList';
import UserCard from '../../components/Common/UserCard';

import { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Container,
  Skeleton,
  Card,
  CardContent,
  Typography,
  Divider,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
} from '@mui/material';

import {
  deleteAPI,
  getUserAtProject,
  changeProjectHost,
  getProjectByUserId,
  quitProject,
} from '../../pages/api/project';
import * as projectActions from '../../store/module/project';

import Router from 'next/router';

function ProjectInfo() {
  let clubData = useSelector(({ project }) => project.projectDetail);
  const userData = useSelector(({ project }) => project.userList);
  const [reloadCondition, setReloadCondition] = useState(false);
  const dispatch = useDispatch();

  function fetchData() {
    getUserAtProject({
      projectId: clubData.id,
      userId: sessionStorage.getItem('userId'),
    })
      .then((res) => {
        dispatch(projectActions.setUserList({ list: res.users }));
      })
      .catch((err) => console.log(err));

    getProjectByUserId(parseInt(sessionStorage.getItem('userId'))).then(
      (res) => {
        dispatch(projectActions.setMyProject({ project: res.project }));
        dispatch(projectActions.setProjectDetail({ detail: res.project }));
      }
    );
  }

  useLayoutEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reloadCondition) {
      fetchData();
      setReloadCondition(false);
    }
  });

  const CusContainer = styled(Container)`
    float: left;
    margin-bottom: 50px;
  `;

  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 30px;
    flex: 1;
  `;

  const DetailWrapper = styled.div`
    display: flex;
    flex-direction: row;
  `;

  const CusSkeleton = styled(Skeleton)`
    display: flex;
    flex: 1;
    min-width: 200px;
    min-height: 200px;
    height: auto;
  `;

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
  `;

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
  );

  function DetailOperation({ detail }) {
    const [openQuit, setOpenQuit] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);

    const QuitDialogOpen = () => {
      if (sessionStorage.getItem('userId')) setOpenQuit(true);
      else {
        alert('로그인이 필요한 작업입니다.');
        Router.push('/login');
      }
    };
    const QuitDialogClose = () => {
      setOpenQuit(false);
    };

    const UserDialogOpen = () => {
      setOpenUsers(true);
    };
    const UserDialogClose = () => {
      setOpenUsers(false);
    };

    const [hostAssign, setHostAssign] = useState(null);
    const [nextHost, setNextHost] = useState(null);

    return (
      <>
        {sessionStorage.getItem('userId') == detail.hostId ? (
          <Button
            variant="outlined"
            onClick={() => {
              Router.push('/project/applylist');
            }}
          >
            지원자 목록 조회
          </Button>
        ) : (
          <div></div>
        )}
        <ButtonGroup variant="outlined">
          {sessionStorage.getItem('userId') == clubData.hostId ? (
            <Button
              onClick={() => {
                Router.push('/project/update');
              }}
            >
              수정
            </Button>
          ) : null}
          <Button onClick={QuitDialogOpen}>탈퇴</Button>
        </ButtonGroup>

        <Dialog open={openUsers} onClose={UserDialogClose}>
          <DialogTitle>{'방장 권한을 넘길 유저를 선택해주세요.'}</DialogTitle>
          <DialogContent>
            <FormControl>
              <RadioGroup
                name="newHost"
                onChange={(e) => {
                  e.persist();
                  setNextHost(e.target.value);
                }}
              >
                {userData
                  ? userData.map((user) => {
                      return user.id !== clubData.hostId ? (
                        <FormControlLabel
                          value={user.id + ',' + user.projectPosition}
                          control={<Radio />}
                          label={user.nickname}
                        />
                      ) : null;
                    })
                  : null}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={UserDialogClose}>취소</Button>
            <Button
              onClick={() => {
                let [newHostId, newHostPosition] = nextHost.split(',');
                changeProjectHost({
                  projectId: clubData.id,
                  oldHostId: clubData.hostId,
                  newHostId: newHostId,
                  newHostPosition: newHostPosition,
                }).then((res) => {
                  if (res.statusCode == 200) {
                    alert('방장이 변경되었습니다.');
                    quitProject({
                      userId: clubData.hostId,
                      projectId: clubData.id,
                    });
                    Router.push('/project');
                  } else alert(`${res.message}`);
                  // 페이지 새로고침
                });
              }}
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>

        {/* 탈퇴 다이얼로그 */}
        <Dialog open={openQuit} onClose={QuitDialogClose}>
          <DialogTitle>{'프로젝트를 탈퇴 하시겠습니까?'}</DialogTitle>
          <DialogContent>
            {
              // 방장일 경우 방장 넘기기
              sessionStorage.getItem('userId') == detail.hostId ? (
                <DialogContentText>
                  프로젝트를 삭제하거나 방장 권한을 넘길 수 있습니다.<br></br>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={hostAssign}
                      onChange={(e) => {
                        setHostAssign(e.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="quit"
                        control={<Radio />}
                        label="방장 권한 넘기기"
                      />
                      <FormControlLabel
                        value="delete"
                        control={<Radio />}
                        label="프로젝트 삭제"
                      />
                    </RadioGroup>
                  </FormControl>
                </DialogContentText>
              ) : null
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={QuitDialogClose}>취소</Button>
            <Button
              onClick={() => {
                QuitDialogClose();
                // 방장일 때
                if (sessionStorage.getItem('userId') == detail.hostId) {
                  if (hostAssign === null) {
                    alert(
                      '프로젝트 삭제 또는 방장 권한 넘기기를 선택해주세요.'
                    );
                  } else if (hostAssign === 'quit') {
                    if (clubData.positions[9].size == 1) {
                      alert('팀원이 존재하지 않습니다.');
                    } else UserDialogOpen();
                    // 방장 권한 넘기기
                  } else if (hostAssign === 'delete') {
                    deleteAPI({
                      id: clubData.id,
                      hostId: sessionStorage.getItem('userId'),
                    }).then((res) => {
                      if (res.statusCode === 200) {
                        alert('프로젝트가 삭제 되었습니다.');
                        Router.push('/project');
                      } else {
                        alert(`${res.message}`);
                      }
                    });
                    // 프로젝트 삭제
                  }
                } else {
                  // 방장이 아닐 때
                  quitProject({
                    userId: sessionStorage.getItem('userId'),
                    projectId: clubData.id,
                  }).then((res) => {
                    if (res.statusCode === 200) {
                      alert('프로젝트가 탈퇴 되었습니다.');
                      Router.push('/project');
                    } else {
                      alert(`${res.message}`);
                    }
                  });
                }
              }}
              autoFocus
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function ProjectInfo() {
    const DateWrapper = styled.div`
      display: flex;
      flex-direction: row;
      & > div {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    `;

    const RowWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      & > div {
        padding-bottom: 20px;
      }
    `;

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
                {clubData.startDate} ~ {clubData.endDate}
              </Typography>
            </div>
          </DateWrapper>
        </RowWrapper>
      </ContentWrapper>
    );
  }

  function ProjectDetail() {
    const CusCard = styled(Card)`
      margin-top: 10px;
    `;

    return (
      <CusCard sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 16 }} variant="body1">
            {clubData.description.split('\n').map((line, index) => {
              return (
                <span key={index}>
                  {line}
                  <br />
                </span>
              );
            })}
          </Typography>
          <br />
          <Divider light />
          <br />
          <ProjectUser detail={clubData}></ProjectUser>
          <br />
        </CardContent>
      </CusCard>
    );

    function ProjectUser(props) {
      const UserWrapper = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;

        & > div {
          display: flex;
          flex-direction: column;
          margin: 10px;
        }
        & .no-user {
          font-size: 14px;
        }
        & .fill {
          display: flex;
          flex: 1;
        }
      `;

      const FollowerWrapper = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      `;

      return (
        <UserWrapper>
          <div style={{ width: 'fit-content' }}>
            <div>팀장</div>
            <div>
              {userData == null ? (
                <div className="no-user">아직 팀원이 없어요 ㅠ.ㅠ</div>
              ) : (
                userData.map((user) => {
                  return user.id == clubData.hostId ? (
                    <UserCard
                      key={user.id}
                      user={user}
                      from="project"
                      setReloadCondition={setReloadCondition}
                    ></UserCard>
                  ) : null;
                })
              )}
            </div>
          </div>
          <div>
            <div>팀원</div>
            <FollowerWrapper>
              {userData == null ? (
                <div className="no-user">아직 팀원이 없어요 ㅠ.ㅠ</div>
              ) : (
                userData.map((user) => {
                  return user.id != clubData.hostId ? (
                    <UserCard
                      key={user.id}
                      user={user}
                      projectId={clubData.id}
                      hostId={clubData.hostId}
                      from="project"
                      setReloadCondition={setReloadCondition}
                    ></UserCard>
                  ) : null;
                })
              )}
            </FollowerWrapper>
          </div>
        </UserWrapper>
      );
    }
  }
}

export default ProjectInfo;
