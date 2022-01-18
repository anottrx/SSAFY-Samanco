import { useState, useRef, useCallback } from "react";

import styled from "@emotion/styled"
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Pagination from '@mui/material/Pagination';
import projectData from "../../data/projectData.json"
import Router from "next/router";

import { useDispatch } from 'react-redux';
import * as projectActions from '../../store/module/project';

function ItemList() {
    const [page, setPage] = useState(1);
    const purPage = useRef(4);
    let allPage = parseInt(projectData.length / purPage.current);
    if (projectData.length % purPage.current > 0) allPage += 1;

    const handleChange = (index,value) => {
        setPage(value);
    };

    const dispatch = useDispatch();
    // const detail = useSelector(({data}) => data.projectDetail);

    const setDetail = useCallback(
        ({detail}) => {
            dispatch(projectActions.setProjectDetail({detail}))
        },
        [dispatch],
    )

    return (
        <>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4}}>
            {
                projectData.slice(purPage.current * (page-1), purPage.current * page).map((data) => {
                    return (
                        <Grid item xs={12} sm={6} key={data.no}  onClick={()=>{
                            Router.push("/project/"+data.no);
                            setDetail({detail: data});
                        }}>
                            <Item no={data.no}></Item> 
                        </Grid>
                    )
                })
            }
        </Grid>
        <Pagination count={allPage} color="primary" page={page} onChange={handleChange} />
        </>
    )
}

function Item(props) {
    const Container = styled.div`
        display: flex;
        flex-direction: column;
        text-align: left;
    `

    return (
        <Container>
            <Card>
                <Skeleton variant="rectangular" height={100} animation={false} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {props.no}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    )
}

export default ItemList;