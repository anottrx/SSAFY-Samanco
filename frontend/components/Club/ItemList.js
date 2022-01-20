import { useState, useRef, useCallback } from "react";

import styled from "@emotion/styled"
import { Grid, Skeleton, Card, CardContent, Typography, Pagination } from '@mui/material';

import projectData from "../../data/projectData.json"
import Router from "next/router";

import { useDispatch } from 'react-redux';
import * as projectActions from '../../store/module/project';

import StackList from "./StackList"
import stackData from "../../data/StackData.json"

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


function ItemList() {
    const [page, setPage] = useState(1);

    const theme = useTheme();
    
    const xsMaches = useMediaQuery(theme.breakpoints.up('xs'));
    const smMatches = useMediaQuery(theme.breakpoints.up('sm'));
    const mdMatches = useMediaQuery(theme.breakpoints.up('md'));
    const lgMatches = useMediaQuery(theme.breakpoints.up('lg'));
    
    let purPage = useRef();

    if (lgMatches) {
        purPage.current = 8;
    }
    else if (mdMatches) {
        purPage.current = 6;
    } 
    else if (smMatches) {
        purPage.current = 4;
    } 
    else if (xsMaches) {
        purPage.current = 2;
    }


    let allPage = parseInt(projectData.length / purPage.current);
    if (projectData.length % purPage.current > 0) allPage += 1;

    const handleChange = (index,value) => {
        setPage(value);
    };

    const dispatch = useDispatch();

    const setDetail = useCallback(
        ({detail}) => {
            dispatch(projectActions.setProjectDetail({detail}))
        },
        [dispatch],
    )

    const CusPagination = styled(Pagination)`
        margin-top: 20px;
    `;

    const CusGrid = styled(Grid)`
        min-height: 530px;
    `

    return (
        <>
        <CusGrid container maxWidth="lg" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4}}>
            {
                projectData.slice(purPage.current * (page-1), purPage.current * page).map((data) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={data.no}  onClick={()=>{
                            Router.push("/project/"+data.no);
                            setDetail({detail: data});
                        }}>
                            <Item data={data}></Item> 
                        </Grid>
                    )
                })
            }
        </CusGrid>
        <CusPagination count={allPage} color="primary" page={page} onChange={handleChange} />
        </>
    )
}

export function Item(props) {
    let data = props.data;

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        text-align: left;
    `

    return (
        <Container>
            <Card>
                <Skeleton variant="rectangular" height={150} animation={false} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {data.title}
                    </Typography>
                    
                    <StackList stackData={data.stacks}></StackList>
                
                </CardContent>
            </Card>
        </Container>
    )
}

export default ItemList;