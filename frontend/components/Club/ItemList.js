import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react';

import styled from '@emotion/styled';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Badge from '@mui/material/Badge';

import { BadgeUnstyled } from '@mui/base';

import Router from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import * as projectActions from '../../store/module/project';
import * as studyActions from '../../store/module/study';

import {
  getProjectAllAPI,
  getProjectById,
  projectImageDownload,
} from '../../pages/api/project';
import {
  getStudyAllAPI,
  getStudyById,
  studyImageDownload,
} from '../../pages/api/study';

import StackList from './StackList';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function ItemList(props) {
  //-------------- redux dispatch로 값 저장, selector로 불러오기

  const dispatch = useDispatch();

  let clubData, filterData, setDetail, setList;

  if (props.from === 'project') {
    clubData = useSelector(({ project }) => project.projectList);
    filterData = useSelector(({ project }) => project.projectFilterList);
    setDetail = useCallback(
      ({ detail }) => {
        dispatch(projectActions.setProjectDetail({ detail }));
      },
      [dispatch]
    );

    setList = useCallback(
      ({ list }) => {
        dispatch(projectActions.setProjectList({ list }));
      },
      [dispatch]
    );
  } else if (props.from === 'study') {
    clubData = useSelector(({ study }) => study.studyList);
    filterData = useSelector(({ study }) => study.studyFilterList);
    setDetail = useCallback(
      ({ detail }) => {
        dispatch(studyActions.setStudyDetail({ detail }));
      },
      [dispatch]
    );

    setList = useCallback(
      ({ list }) => {
        dispatch(studyActions.setStudyList({ list }));
      },
      [dispatch]
    );
  }

  // 페이지네이션 페이지
  const [page, setPage] = useState(1);

  // 미디어 쿼리에 따라 화면에 보여지는 그리드 수 변경
  const theme = useTheme();

  const xsMaches = useMediaQuery(theme.breakpoints.up('xs'));
  const smMatches = useMediaQuery(theme.breakpoints.up('sm'));
  const mdMatches = useMediaQuery(theme.breakpoints.up('md'));
  const lgMatches = useMediaQuery(theme.breakpoints.up('lg'));

  let purPage = useRef(1);
  let allPage = 1;
  if (clubData) {
    allPage = parseInt(clubData.length / purPage.current);
    if (clubData.length % purPage.current > 0) allPage += 1;

    if (lgMatches) {
      purPage.current = 8;
    } else if (mdMatches) {
      purPage.current = 6;
    } else if (smMatches) {
      purPage.current = 4;
    } else if (xsMaches) {
      purPage.current = 2;
    }
  }

  // 화면에 요소를 그리기 전에 store에 저장된 아이템 리스트가 있는지 확인
  // 없으면 store에 저장
  useLayoutEffect(() => {
    // 빈 배열이면 배열 요청
    if (props.from === 'project') {
      getProjectAllAPI().then((res) => setList({ list: res.projects }));
    } else if (props.from === 'study') {
      getStudyAllAPI().then((res) => setList({ list: res.studies }));
    } else {
      setList({ list: [] });
    }
  }, []);

  const handleChange = (index, value) => {
    setPage(value);
  };

  const CusPagination = styled(Pagination)`
    margin-top: 20px;
  `;

  const CusGrid = styled(Grid)`
    min-height: 530px;
  `;

  const CusCard = styled(Card)`
    width: 100%;
    padding: 10px;
  `;

  return (
    <>
      {!clubData || clubData.length == 0 ? (
        <CusGrid>
          <CusCard>등록된 데이터가 없습니다.</CusCard>
        </CusGrid>
      ) : (
        <CusGrid
          container
          maxWidth="lg"
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        >
          {
            // 검색된 데이터가 있을 때
            filterData != null
              ? filterData
                  .slice(purPage.current * (page - 1), purPage.current * page)
                  .map((data) => {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
                        <Item
                          data={data}
                          setDetail={setDetail}
                          from={props.from}
                        ></Item>
                      </Grid>
                    );
                  })
              : clubData
                  .slice(purPage.current * (page - 1), purPage.current * page)
                  .map((data) => {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
                        <Item
                          data={data}
                          setDetail={setDetail}
                          from={props.from}
                        ></Item>
                      </Grid>
                    );
                  })
          }
        </CusGrid>
      )}

      <CusPagination
        count={allPage}
        color="primary"
        page={page}
        onChange={handleChange}
      />
    </>
  );
}

export function Item(props) {
  let { data, setDetail, from } = props;
  let [imageUrl, setImageUrl] = useState(undefined);

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    cursor: pointer;
  `;

  const CusCountBadge = styled(Badge)`
    top: 25px;
    right: 30px;
  `;

  const CusDeadlineBadge = styled(BadgeUnstyled)`
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum';
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';
    position: relative;
    display: inline-block;
    line-height: 1;

    & .MuiBadge-badge {
      z-index: auto;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      color: #fff;
      font-weight: 400;
      font-size: 11px;
      line-height: 20px;
      white-space: nowrap;
      text-align: center;
      background: #837e7e;
      border-radius: 10px;
      box-shadow: 0 0 0 1px #fff;
    }

    & .MuiBadge-anchorOriginTopRight {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(-15px, 115px);
      transform-origin: 100% 0;
    }
  `;

  const EndImage = styled.img`
    width: 80px;
    height: 80px;
    float: left;
    transform: translate(20%, 20%);
    // margin-right: auto;
    // transform: translate(-90%, 10%);
    position: absolute;
  `;

  const DefaultImage = styled.div`
    height: 150px;
    background-color: #e0e0e0;
    background-image: url('/images/profile_default_gen0.png');
    background-size: 30%;
    background-repeat: no-repeat;
    background-position: center center;
  `;

  let totalSize = 0,
    currSize = 0;
  if (from === 'project') {
    data.positions.map((curr) => {
      if (curr.position === 'totalSize') totalSize = curr.size;
      if (curr.position === 'currentSize') currSize = curr.size;
    });
  }

  let leftDay = '';
  if (data.deadline < 0) leftDay = '+' + -1 * data.deadline;
  else if (data.deadline == 0) leftDay = '-DAY';
  else leftDay = '-' + data.deadline;

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
      // const imageEl = document.getElementById('imageEl');
      // if (imageEl) {
      const url = window.URL.createObjectURL(blob);
      setImageUrl(url);
      // imageEl.style.backgroundImage = `url(${url})`;
      // imageEl.style.width = '100%';
      // imageEl.style.height = '200px';
      // imageEl.setAttribute('src', url);
      // }
    }
  }

  function getImageUrl(file) {
    if (from === 'project') {
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
    if (data.file) {
      getImageUrl(data.file);
    }
  }, []);

  return (
    <Container
      onClick={() => {
        if (from === 'project') {
          getProjectById({
            projectId: data.id,
            userId:
              sessionStorage.getItem('userId') == null
                ? 0
                : sessionStorage.getItem('userId'),
          }).then((res) => {
            setDetail({ detail: res.project });
            Router.push({
              pathname: `/${from}/[id]`,
              query: { id: data.id },
            });
          });
        } else if (from === 'study') {
          getStudyById({
            studyId: data.id,
            userId:
              sessionStorage.getItem('userId') == null
                ? 0
                : sessionStorage.getItem('userId'),
          }).then((res) => {
            setDetail({ detail: res.study });
            Router.push({
              pathname: `/${from}/[id]`,
              query: { id: data.id },
            });
          });
        }
      }}
    >
      {from === 'project' ? (
        <>
          <CusCountBadge
            badgeContent={currSize + ' / ' + totalSize}
            color="primary"
          ></CusCountBadge>
          <CusDeadlineBadge
            badgeContent={'D' + leftDay + ' | ♥ ' + data.likes}
          ></CusDeadlineBadge>
        </>
      ) : (
        <CusDeadlineBadge badgeContent={'♥ ' + data.likes}></CusDeadlineBadge>
      )}
      {/* <CusLikeBadge badgeContent={"좋아요 "+data.likes)}></CusLikeBadge> */}

      <Card>
        {data.collectStatus !== 'ING' ? (
          <EndImage src="/images/apply_end.png"></EndImage>
        ) : null}
        {
          data.file ? (
            <img
              src={imageUrl}
              height={150}
              style={{ objectFit: 'contain', width: '100%' }}
            ></img>
          ) : (
            <DefaultImage></DefaultImage>
          )

          // data.collectStatus === 'ING' ? (
          //   <Skeleton variant="rectangular" height={150} animation={false} />
          // ) : (
          //   <>
          //     <EndImage src="/images/apply_end.png"></EndImage>
          //     <Skeleton variant="rectangular" height={150} animation={false} />
          //   </>
          // )
        }

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.title}
          </Typography>

          {/* 리스트에서 보이는 클럽 스택은 최대 3개까지 표시 */}
          <StackList
            stackData={
              data.stacks.length > 3 ? data.stacks.slice(0, 3) : data.stacks
            }
          ></StackList>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ItemList;
