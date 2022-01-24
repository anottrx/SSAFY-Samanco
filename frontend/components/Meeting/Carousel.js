import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "@emotion/styled";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import projectData from "../../data/projectData.json"

import { useState, useEffect } from "react";

const CarouselWrapper = styled.div`
    text-align: center;
    padding: 0px 0px 20px 0px;

    & .slick-slide{
        padding: 10px;
    }
`

export default function Carousel(props) {
    const [settings, changeSettings] = useState({
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4
    });

    // 페이지네이션 페이지
    const [page, setPage] = useState(1);
    let purPage = useRef(4);
    let allPage = parseInt(props.users.length / purPage.current);
    if (props.users.length % purPage.current > 0) allPage += 1;

    const handleChange = (index,value) => {
        setPage(value);
    };

    return (
    <CarouselWrapper>
        <Slider {...settings}>
        {
            props.users.slice(purPage.current * (page-1), purPage.current * page).map((data, index) => {
                return (
                    <Item key={index} data={data}></Item> 
                )
            })
        }
        </Slider>
    </CarouselWrapper>
    );
  }