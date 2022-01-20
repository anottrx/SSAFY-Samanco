import { useState, useRef, useCallback } from "react";

import styled from "@emotion/styled"
import { Grid, Skeleton, Card, CardContent, Typography, Pagination } from '@mui/material';

import projectData from "../../data/projectData.json"
import Router from "next/router";

import { useDispatch } from 'react-redux';
import * as projectActions from '../../store/module/project';

import StackList from "./StackList"
import stackData from "../../data/StackData.json"

function ItemList() {
    const [page, setPage] = useState(1);
    const purPage = useRef(6);
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
        <CusGrid container maxWidth="md" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4}}>
            {
                projectData.slice(purPage.current * (page-1), purPage.current * page).map((data) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} key={data.no}  onClick={()=>{
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

function Item(props) {
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