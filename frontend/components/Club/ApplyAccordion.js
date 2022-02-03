import StackItem from "../../components/Common/Stack/item"
import StackLevelList from "../../components/Common/Stack/StackLevelList"

import { Accordion, AccordionSummary, AccordionDetails, Typography, Skeleton, Stack, Link, ButtonGroup, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import { getProjectUserByjoin } from "../../pages/api/project"
import { getStudyUserByjoin } from "../../pages/api/study"
import { useDispatch } from 'react-redux';

import { forceReload } from "../../util/ForceReload";


function ApplyAccordion(props) {
    const dispatch = useDispatch();
    
    const SummaryWrapper = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;

      & > p {
        font-weight: bolder;
        margin-right: 10px;
      }
    `
    const ProfileWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;

      & :first-of-type {
        margin-right: 10px;
      }

      & .linkWrapper a, .linkWrapper a:visited{
        font-size: 12px;
        color: #1976d2;
      }

      & .linkWrapper a:hover{
        color: #0342A2;
      }
    `

    const ButtonWrapper = styled(ButtonGroup)`
      display: flex;
      justify-content: flex-end;
    `
    return (
        <div>
          {
            props.applyData?
            props.applyData.map(data => {
              return(
                <Accordion key={data.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <SummaryWrapper>
                      <Typography>{data.nickname}</Typography>
                      <StackItem title={data.projectPosition}></StackItem>
                    </SummaryWrapper>
                  </AccordionSummary>

                  <AccordionDetails>
                    <ProfileWrapper>
                      <Skeleton variant="circular" width={100} height={100} />
                      <Stack>
                        <Typography>{data.description}</Typography>
                        {/* {
                          data.links.map(link => {
                            return (
                              <div className="linkWrapper">
                                <Link underline="none" href={link.url} target="_blank">
                                <LinkIcon />{link.url}</Link>
                              </div>
                            )
                          })
                        } */}
                        <div className="linkWrapper">
                          <Link underline="none" href={data.link} target="_blank">
                          <LinkIcon />{data.link}</Link>
                        </div>
                      </Stack>
                      

                    </ProfileWrapper>
                    <StackLevelList items={data.stacks}></StackLevelList>

                    <ButtonWrapper className="btnGroup" variant="outlined" aria-label="outlined button group">
                      <Button onClick={() => {
                        // 가입 승인
                        let approveData = {
                          userId: data.id,
                          hostId: sessionStorage.getItem("userId"),
                          joinTag: "OK"
                        };
                        let joinData = {
                          userId: sessionStorage.getItem("userId")
                        }
                        switch (props.from) {
                          case "project":
                            approveData = {
                              ...approveData,
                              projectId: props.clubId,
                            };
                            joinData = {
                              ...joinData,
                              projectId: props.clubId,
                            };
                            break;
                          case "study":
                            approveData = {
                              ...approveData,
                              studyId: props.clubId,
                            };
                            joinData = {
                              ...joinData,
                              studyId: props.clubId,
                            }
                            break;
                          default:
                            break;
                        }

                        props.approveAPI(approveData).then(res => {
                          if (res.statusCode == 200) {
                            alert("해당 유저의 가입을 승인하였습니다.")
                            if (props.from === "project"){
                              getProjectUserByjoin(joinData) // 재조회
                                .then(res => { 
                                    dispatch(applyActions.setApplyList({list: res.users}));
                                })
                                .catch(err => console.log(err))
                            } else {
                              getStudyUserByjoin(joinData) // 재조회
                                .then(res => { 
                                    dispatch(applyActions.setApplyList({list: res.users}));
                                })
                                .catch(err => console.log(err))
                            }
                          } else {
                            alert(`${res.message}`)
                          }
                        });
                        
                        forceReload();
                      }}><CheckIcon/></Button>
                      <Button  onClick={() => {
                        // 가입 거절
                        let approveData = {
                          userId: data.id,
                          hostId: sessionStorage.getItem("userId"),
                          joinTag: "NO"
                        };
                        let joinData = {
                          userId: sessionStorage.getItem("userId")
                        }

                        switch (props.from) {
                          case "project":
                            approveData = {
                              ...approveData,
                              projectId: props.clubId,
                            };
                            joinData = {
                              ...joinData,
                              projectId: props.clubId,
                            };
                            break;
                          case "study":
                            approveData = {
                              ...approveData,
                              studyId: props.clubId,
                            };
                            joinData = {
                              ...joinData,
                              studyId: props.clubId,
                            }
                            break;
                          default:
                            break;
                        }

                        props.approveAPI(approveData).then(res => {
                          if (res.statusCode == 200) {
                            alert("해당 유저의 가입을 거절하였습니다.")
                            if (props.from === "project"){
                              getProjectUserByjoin(joinData) // 재조회
                                .then(res => { 
                                    dispatch(applyActions.setApplyList({list: res.users}));
                                })
                                .catch(err => console.log(err))
                            } else {
                              getStudyUserByjoin(joinData) // 재조회
                                .then(res => { 
                                    dispatch(applyActions.setApplyList({list: res.users}));
                                })
                                .catch(err => console.log(err))
                            }
                          } else {
                            alert(`${res.message}`)
                          }
                        });
                        
                        forceReload();
                      }}><CloseIcon/></Button>
                    </ButtonWrapper>

                  </AccordionDetails>
                </Accordion>
              )
            }) : <div>아직 지원한 지원자가 없습니다 ㅜ.ㅜ</div>
          }
    </div>
    )
}

export default ApplyAccordion;