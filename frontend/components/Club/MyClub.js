import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import styled from '@emotion/styled';
import * as projectActions from '../../store/module/project';
import * as studyActions from '../../store/module/study';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import {
  getProjectByUserId,
  projectImageDownload,
} from '../../pages/api/project';
import { getStudyByUserId, studyImageDownload } from '../../pages/api/study';
import { useLayoutEffect, useState, useEffect } from 'react';

import StackList from '../Club/StackList';
import Router from 'next/router';

const CarouselWrapper = styled.div`
  text-align: left;
  padding: 0px 0px 20px 0px;

  & .slick-slide {
    padding: 10px;
  }

  & .slick-prev:before,
  .slick-next:before {
    color: #837e7e;
  }
`;

function MyClub(props) {
  const MyClubWrapper = styled.div`
    width: 100%;
    & .img-wrapper {
      background-color: #c9c9c9;
      width: 150px;
      height: 150px;
      border-radius: 10px;
    }
  `;

  const CusDivider = styled(Divider)`
    margin: 20px 0px;
  `;

  const CusGrid = styled(Grid)`
    min-height: 530px;
  `;

  const CusCard = styled(Card)`
    width: 100%;
    padding: 10px;
  `;

  const dispatch = useDispatch();
  let clubData;
  let myData;
  if (props.from === 'project') {
    clubData = useSelector(({ project }) => project.myProject);
    if (props.myinfo === 'myinfo') {
      myData = 'project';
    }
  } else if (props.from === 'study') {
    clubData = useSelector(({ study }) => study.myStudy);
    if (props.myinfo === 'myinfo') {
      myData = 'study';
    }
  }

  useLayoutEffect(() => {
    switch (props.from) {
      case 'project':
        getProjectByUserId(
          sessionStorage.getItem('userId') == null
            ? 0
            : sessionStorage.getItem('userId')
        ).then((res) => {
          dispatch(projectActions.setMyProject({ project: res.project }));
          dispatch(projectActions.setProjectDetail({ detail: res.project }));
        });
        break;
      case 'study':
        getStudyByUserId(
          sessionStorage.getItem('userId') == null
            ? 0
            : sessionStorage.getItem('userId')
        ).then((res) => {
          dispatch(studyActions.setMyStudy({ study: res.studies }));
        });
        break;
      default:
        break;
    }
  }, []);

  return !clubData ? ( // 데이터가 없는 경우
    myData == 'project' || myData === 'study' ? (
      // 마이페이지에서 내프로젝트와 내스터디로 이동한 경우
      <MyClubWrapper>
        <h2>{props.label}</h2>
        <CusGrid>
          {myData == 'project' ? ( // 내 프로젝트가 없다면
            <CusCard>
              <Link href="/project" passHref>
                가입한 프로젝트가 없습니다. 프로젝트를 둘러보세요!
              </Link>
            </CusCard>
          ) : myData == 'study' ? ( // 내 스터디가 없다면
            <CusCard>
              <Link href="/study" passHref>
                가입한 스터디가 없습니다. 스터디를 둘러보세요!
              </Link>
            </CusCard>
          ) : null}
        </CusGrid>
      </MyClubWrapper>
    ) : null // 프로젝트와 스터디 목록인 경우
  ) : (
    <>
      <MyClubWrapper>
        <h2>{props.label}</h2>
        <MyClubItem clubData={clubData}></MyClubItem>
      </MyClubWrapper>
      <CusDivider variant="middle" />
    </>
  );

  function MyClubItem({ clubData }) {
    const CusCardContent = styled(CardContent)`
      display: flex;
      flex-direction: row;
    `;

    const ProjectInfo = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0px 10px;

      & .title {
        font-size: 18px;
      }

      & .date {
        font-size: 10px;
        color: #1976d6;
      }
    `;

    const CusCard = styled(Card)`
      max-width: 430px;
    `;

    const [settings, changeSettings] = useState({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    });

    let [imageUrl, setImageUrl] = useState(undefined);

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

    function getImageUrl(file) {
      if (props.from === 'project') {
        projectImageDownload(file).then((res) => {
          if (res.data && res.data.statusCode === 200 && res.data.fileString) {
            const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
            createAndDownloadBlobFile(arrayBuffer, file.originFile);
          } else {
            // console.log('파일이 존재하지 않습니다. 관리자에게 문의해주세요.');
          }
        });
      } else {
        studyImageDownload(file).then((res) => {
          if (res.data && res.data.statusCode === 200 && res.data.fileString) {
            const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
            createAndDownloadBlobFile(arrayBuffer, file.originFile);
          } else {
            // console.log('파일이 존재하지 않습니다. 관리자에게 문의해주세요.');
          }
        });
      }
    }

    useEffect(() => {
      if (clubData.id !== undefined && clubData.file) {
        // 프로젝트일 때
        getImageUrl(clubData.file);
      }
    }, []);

    // 클럽 데이터에 아이디가 없는지? -> (true) 없으면 스터디, (false) 있으면 프로젝트
    console.log(clubData.id === undefined);

    return clubData.id === undefined ? (
      <CarouselWrapper>
        <Slider {...settings}>
          {
            // 스터디이면
            Object.keys(clubData).map((key, index) => {
              let data = clubData[key];
              return (
                <CusCard key={index}>
                  <CusCardContent>
                    <CardImages data={data}></CardImages>

                    <ProjectInfo>
                      <div className="title">{data.title}</div>
                      {props.from === 'project' ? (
                        <div className="date">
                          {data.startDate} ~ {data.endDate}
                        </div>
                      ) : (
                        <div className="date">{data.schedule}</div>
                      )}

                      {/* 리스트에서 보이는 클럽 스택은 최대 3개까지 표시 */}
                      {data.stacks ? (
                        <StackList
                          stackData={
                            data.stacks.length > 3
                              ? data.stacks.slice(0, 3)
                              : data.stacks
                          }
                        ></StackList>
                      ) : null}
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (props.from === 'project') {
                            // dispatch(projectActions.setMyProject({project: data}))
                            dispatch(
                              projectActions.setProjectDetail({ detail: data })
                            );
                            Router.push('/project/info');
                          } else if (props.from === 'study') {
                            dispatch(
                              studyActions.setStudyDetail({ detail: data })
                            );
                            Router.push({
                              pathname: '/study/info/[sid]',
                              query: { sid: data.id },
                            });
                          }
                        }}
                      >
                        상세 보기{' '}
                      </Button>
                    </ProjectInfo>
                  </CusCardContent>
                </CusCard>
              );
            })
          }
        </Slider>
      </CarouselWrapper>
    ) : (
      // 프로젝트이면
      <CusCard>
        <CusCardContent>
          {clubData.file ? (
            <img
              src={imageUrl}
              height={150}
              style={{ objectFit: 'contain' }}
            ></img>
          ) : (
            <div className="img-wrapper"></div>
          )}
          <ProjectInfo>
            <div className="title">{clubData.title}</div>
            {props.from === 'project' ? (
              <div className="date">
                {clubData.startDate} ~ {clubData.endDate}
              </div>
            ) : (
              <div className="date">{clubData.schedule}</div>
            )}

            {/* 리스트에서 보이는 클럽 스택은 최대 3개까지 표시 */}
            {clubData.stacks ? (
              <StackList
                stackData={
                  clubData.stacks.length > 3
                    ? clubData.stacks.slice(0, 3)
                    : clubData.stacks
                }
              ></StackList>
            ) : null}
            <Button
              variant="outlined"
              onClick={() => {
                if (props.from === 'project') {
                  dispatch(projectActions.setMyProject({ project: clubData }));
                  dispatch(
                    projectActions.setProjectDetail({ detail: clubData })
                  );
                  Router.push('/project/info');
                } else if (props.from === 'study') {
                  dispatch(studyActions.setMyStudy({ study: clubData }));
                  dispatch(studyActions.setStudyDetail({ detail: clubData }));
                  Router.push('/study/info');
                }
              }}
            >
              상세 보기{' '}
            </Button>
          </ProjectInfo>
        </CusCardContent>
      </CusCard>
    );
  }
}

function CardImages({ data }) {
  const DefaultImage = styled.div`
    width: 150px;
    height: 150px;
    background-color: #e0e0e0;
    background-image: url('/images/profile_default_gen0.png');
    background-size: 30%;
    background-repeat: no-repeat;
    background-position: center center;
  `;

  const [imageUrl, setImageUrl] = useState();
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

  function getImageUrl(file) {
    studyImageDownload(file).then((res) => {
      if (res.data && res.data.statusCode === 200 && res.data.fileString) {
        const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
        createAndDownloadBlobFile(arrayBuffer, file.originFile);
      }
    });
  }

  useEffect(() => {
    if (data.file) {
      getImageUrl(data.file);
    }
  }, []);

  return data.file ? (
    <img src={imageUrl} height={150} style={{ objectFit: 'contain' }}></img>
  ) : (
    <DefaultImage />
  );
}

export default MyClub;
