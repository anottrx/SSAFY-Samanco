import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "@emotion/styled";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { Item } from "./ItemList";
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
    const theme = useTheme();
    
    const xsMaches = useMediaQuery(theme.breakpoints.up('xs'));
    const smMatches = useMediaQuery(theme.breakpoints.up('sm'));
    const mdMatches = useMediaQuery(theme.breakpoints.up('md'));
    const lgMatches = useMediaQuery(theme.breakpoints.up('lg'));
    
    const [settings, changeSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500
    });

    if (lgMatches) {
        settings.slidesToShow = 4;
        settings.slidesToScroll = 4;
    }
    else if (mdMatches) {
        settings.slidesToShow = 3;
        settings.slidesToScroll = 3;
    } 
    else if (smMatches) {
        settings.slidesToShow = 2;
        settings.slidesToScroll = 2;
    } 
    else if (xsMaches) {
        settings.slidesToShow = 1;
        settings.slidesToScroll = 1;
    }

    return (
    <CarouselWrapper>
        <h2>{props.label}</h2>
        <Slider {...settings}>
        {
            projectData.slice(0, 6).map((data) => {
                return (
                    <Item data={data}></Item> 
                )
            })
        }
        </Slider>
    </CarouselWrapper>
    );
  }