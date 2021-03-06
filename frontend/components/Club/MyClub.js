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

  return !clubData ? ( // ???????????? ?????? ??????
    myData == 'project' || myData === 'study' ? (
      // ????????????????????? ?????????????????? ??????????????? ????????? ??????
      <MyClubWrapper>
        <h2>{props.label}</h2>
        <CusGrid>
          {myData == 'project' ? ( // ??? ??????????????? ?????????
            <CusCard>
              <Link href="/project" passHref>
                ????????? ??????????????? ????????????. ??????????????? ???????????????!
              </Link>
            </CusCard>
          ) : myData == 'study' ? ( // ??? ???????????? ?????????
            <CusCard>
              <Link href="/study" passHref>
                ????????? ???????????? ????????????. ???????????? ???????????????!
              </Link>
            </CusCard>
          ) : null}
        </CusGrid>
      </MyClubWrapper>
    ) : null // ??????????????? ????????? ????????? ??????
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
            // console.log('????????? ???????????? ????????????. ??????????????? ??????????????????.');
          }
        });
      } else {
        studyImageDownload(file).then((res) => {
          if (res.data && res.data.statusCode === 200 && res.data.fileString) {
            const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
            createAndDownloadBlobFile(arrayBuffer, file.originFile);
          } else {
            // console.log('????????? ???????????? ????????????. ??????????????? ??????????????????.');
          }
        });
      }
    }

    useEffect(() => {
      if (clubData.id !== undefined && clubData.file) {
        // ??????????????? ???
        getImageUrl(clubData.file);
      }
    }, []);

    // ?????? ???????????? ???????????? ?????????? -> (true) ????????? ?????????, (false) ????????? ????????????
    // console.log(clubData.id === undefined);

    return clubData.id === undefined ? (
      <CarouselWrapper>
        <Slider {...settings}>
          {
            // ???????????????
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

                      {/* ??????????????? ????????? ?????? ????????? ?????? 3????????? ?????? */}
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
                        ?????? ??????{' '}
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
      // ??????????????????
      <CusCard>
        <CusCardContent>
          {clubData.file ? (
            <img
              src={imageUrl}
              width={150}
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

            {/* ??????????????? ????????? ?????? ????????? ?????? 3????????? ?????? */}
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
              ?????? ??????{' '}
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
    <img
      src={imageUrl}
      width={150}
      height={150}
      style={{ objectFit: 'contain' }}
    ></img>
  ) : (
    <DefaultImage />
  );
}

export default MyClub;
