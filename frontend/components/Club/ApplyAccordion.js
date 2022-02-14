import StackItem from '../../components/Common/Stack/item';
import StackLevelList from '../../components/Common/Stack/StackLevelList';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import { getProjectUserByjoin } from '../../pages/api/project';
import { getStudyUserByjoin, studyImageDownload } from '../../pages/api/study';
import { useDispatch } from 'react-redux';
import * as applyActions from '../../store/module/apply';

import { useState, useEffect } from 'react';

// project/[id], study/[id] 에 reloadCondition
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
  `;

  const ProfileWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    & :first-of-type {
      margin-right: 10px;
    }

    & .linkWrapper a,
    .linkWrapper a:visited {
      font-size: 12px;
      color: #1976d2;
    }

    & .linkWrapper a:hover {
      color: #0342a2;
    }
  `;

  const ButtonWrapper = styled(ButtonGroup)`
    display: flex;
    justify-content: flex-end;
  `;

  const DefaultImage = styled.div`
    width: 100px;
    height: 100px;
    // background-color: #e0e0e0;
    background-image: url('/images/profile_default_gen0.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  `;

  return (
    <div>
      {props.applyData ? (
        props.applyData.map((data) => {
          console.log('userData', data);
          return (
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
                  {data.file ? (
                    <UserImage file={data.file} />
                  ) : (
                    <DefaultImage />
                  )}
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
                        <LinkIcon />
                        {data.link}
                      </Link>
                    </div>
                  </Stack>
                </ProfileWrapper>
                <StackLevelList items={data.stacks}></StackLevelList>

                <ButtonWrapper
                  className="btnGroup"
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <Button
                    onClick={() => {
                      // 가입 승인
                      Swal.fire({
                        title: '가입 승인 중입니다',
                        showConfirmButton: false,
                        didOpen: () => {
                          Swal.showLoading();

                          let approveData = {
                            userId: data.id,
                            hostId:
                              sessionStorage.getItem('userId') == null
                                ? 0
                                : sessionStorage.getItem('userId'),
                            joinTag: 'OK',
                          };
                          let joinData = {
                            userId:
                              sessionStorage.getItem('userId') == null
                                ? 0
                                : sessionStorage.getItem('userId'),
                          };
                          switch (props.from) {
                            case 'project':
                              approveData = {
                                ...approveData,
                                projectId: props.clubId,
                              };
                              joinData = {
                                ...joinData,
                                projectId: props.clubId,
                              };
                              break;
                            case 'study':
                              approveData = {
                                ...approveData,
                                studyId: props.clubId,
                              };
                              joinData = {
                                ...joinData,
                                studyId: props.clubId,
                              };
                              break;
                            default:
                              break;
                          }

                          props.approveAPI(approveData).then((res) => {
                            if (res.statusCode == 200) {
                              // alert('해당 유저의 가입을 승인하였습니다.');
                              Swal.fire({
                                icon: 'success',
                                title: '해당 유저의 가입을 승인하였습니다.',
                                confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                              }).then(() => {
                                if (props.from === 'project') {
                                  getProjectUserByjoin(joinData) // 재조회
                                    .then((res) => {
                                      dispatch(
                                        applyActions.setApplyList({
                                          list: res.users,
                                        })
                                      );
                                    })
                                    .catch((err) => console.log(err));
                                } else {
                                  getStudyUserByjoin(joinData) // 재조회
                                    .then((res) => {
                                      dispatch(
                                        applyActions.setApplyList({
                                          list: res.users,
                                        })
                                      );
                                    })
                                    .catch((err) => console.log(err));
                                }
                              });
                            } else {
                              // alert(`${res.message}`);
                              Swal.fire({
                                icon: 'error',
                                title: res.message,
                                confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                              });
                            }
                          });

                          props.setReloadCondition(true);
                        },
                      });
                    }}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      // 가입 거절
                      Swal.fire({
                        title: '가입 거절 중입니다',
                        showConfirmButton: false,
                        didOpen: () => {
                          Swal.showLoading();

                          let approveData = {
                            userId: data.id,
                            hostId: sessionStorage.getItem('userId'),
                            joinTag: 'NO',
                          };
                          let joinData = {
                            userId: sessionStorage.getItem('userId'),
                          };

                          switch (props.from) {
                            case 'project':
                              approveData = {
                                ...approveData,
                                projectId: props.clubId,
                              };
                              joinData = {
                                ...joinData,
                                projectId: props.clubId,
                              };
                              break;
                            case 'study':
                              approveData = {
                                ...approveData,
                                studyId: props.clubId,
                              };
                              joinData = {
                                ...joinData,
                                studyId: props.clubId,
                              };
                              break;
                            default:
                              break;
                          }

                          props.approveAPI(approveData).then((res) => {
                            if (res.statusCode == 200) {
                              // alert('해당 유저의 가입을 거절하였습니다.');
                              Swal.fire({
                                icon: 'warning',
                                title: '해당 유저의 가입을 거절하였습니다.',
                                text: '해당 유저는 앞으로 지원을 할 수 없습니다.',
                                confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                              }).then(() => {
                                if (props.from === 'project') {
                                  getProjectUserByjoin(joinData) // 재조회
                                    .then((res) => {
                                      dispatch(
                                        applyActions.setApplyList({
                                          list: res.users,
                                        })
                                      );
                                    })
                                    .catch((err) => console.log(err));
                                } else {
                                  getStudyUserByjoin(joinData) // 재조회
                                    .then((res) => {
                                      dispatch(
                                        applyActions.setApplyList({
                                          list: res.users,
                                        })
                                      );
                                    })
                                    .catch((err) => console.log(err));
                                }
                              });
                            } else {
                              // alert(`${res.message}`);
                              Swal.fire({
                                icon: 'error',
                                title: res.message,
                                confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                              });
                            }
                          });

                          props.setReloadCondition(true);
                        },
                      });
                    }}
                  >
                    <CloseIcon />
                  </Button>
                </ButtonWrapper>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <div>아직 지원한 지원자가 없습니다 ㅜ.ㅜ</div>
      )}
    </div>
  );
}

function UserImage({ file }) {
  let [imageUrl, setImageUrl] = useState(undefined);

  useEffect(() => {
    // first;
  }, []);

  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64); // Comment this if not using base64
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }

  function createAndDownloadBlobFile(body, filename) {
    const blob = new Blob([body]);
    const fileName = `${filename}`;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const url = window.URL.createObjectURL(blob);
      setImageUrl(url);
    }
  }

  function changeToBlob(file) {
    studyImageDownload(file).then((res) => {
      //console.log(res);
      if (res.data && res.data.statusCode === 200 && res.data.fileString) {
        //console.log(res.data);
        const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
        createAndDownloadBlobFile(arrayBuffer, file.originFile);
      } else {
        console.log('파일이 존재하지 않습니다. 관리자에게 문의해주세요.');
      }
    });
  }

  useEffect(() => {
    changeToBlob(file);
  }, []);

  return (
    <img
      src={imageUrl}
      height={100}
      width={100}
      style={{ objectFit: 'contain' }}
    ></img>
  );
}

export default ApplyAccordion;
