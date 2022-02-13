import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from '@emotion/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { Item } from './ItemList';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProjectByDeadLine,
  getProjectByLike,
} from '../../pages/api/project';
import { getStudyByLike } from '../../pages/api/study';
import * as projectActions from '../../store/module/project';
import * as studyActions from '../../store/module/study';
import { Router } from 'next/router';

const CarouselWrapper = styled.div`
  text-align: center;
  padding: 0px 0px 20px 0px;

  & .slick-slide {
    padding: 10px;
    max-width: 390px;
  }

  & .slick-prev:before,
  .slick-next:before {
    color: #837e7e;
  }
`;

export default function Carousel(props) {
  let [clubData, setClubData] = useState([]);
  const theme = useTheme();

  const xsMaches = useMediaQuery(theme.breakpoints.up('xs'));
  const smMatches = useMediaQuery(theme.breakpoints.up('sm'));
  const mdMatches = useMediaQuery(theme.breakpoints.up('md'));
  const lgMatches = useMediaQuery(theme.breakpoints.up('lg'));

  const [settings, changeSettings] = useState({
    dots: true,
    infinite: true,
    speed: 500,
  });

  if (clubData && lgMatches) {
    if (clubData.length >= 4) {
      settings.slidesToShow = 4;
      settings.slidesToScroll = 4;
    } else {
      settings.slidesToShow = clubData.length;
      settings.slidesToScroll = clubData.length;
    }
  } else if (clubData && mdMatches) {
    if (clubData.length >= 3) {
      settings.slidesToShow = 3;
      settings.slidesToScroll = 3;
    } else {
      settings.slidesToShow = clubData.length;
      settings.slidesToScroll = clubData.length;
    }
  } else if (clubData && smMatches) {
    if (clubData.length >= 2) {
      settings.slidesToShow = 2;
      settings.slidesToScroll = 2;
    } else {
      settings.slidesToShow = clubData.length;
      settings.slidesToScroll = clubData.length;
    }
  } else if (clubData && xsMaches) {
    settings.slidesToShow = 1;
    settings.slidesToScroll = 1;
  } else {
    settings.slidesToShow = 1;
    settings.slidesToScroll = 1;
  }

  const dispatch = useDispatch();

  let setDetail;

  if (props.target === 'project') {
    setDetail = useCallback(
      ({ detail }) => {
        dispatch(projectActions.setProjectDetail({ detail }));
      },
      [dispatch]
    );
  } else if (props.target === 'study') {
    setDetail = useCallback(
      ({ detail }) => {
        dispatch(studyActions.setStudyDetail({ detail }));
      },
      [dispatch]
    );
  }

  useEffect(() => {
    if (props.target === 'project') {
      if (props.subject === 'deadline') {
        getProjectByDeadLine().then((res) => {
          // setClubData(res.projects);
          let deadlineProjects = res.projects.filter((el) => el.deadline >= 0); // 마감된 프로젝트는 가리기
          setClubData(deadlineProjects);
        });
      } else {
        getProjectByLike().then((res) => setClubData(res.projects));
      }
    } else if (props.target === 'study') {
      getStudyByLike().then((res) => setClubData(res.studies));
    }
  }, []);

  return clubData && clubData.length > 0 ? (
    <CarouselWrapper>
      <h2>{props.label}</h2>
      <Slider {...settings}>
        {clubData.map((data, index) => {
          return (
            <Item
              key={index}
              data={data}
              setDetail={setDetail}
              from={props.target}
            ></Item>
          );
        })}
      </Slider>
    </CarouselWrapper>
  ) : null;
}
