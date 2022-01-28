import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";

import styled from "@emotion/styled"
import { Grid, Skeleton, Card, CardContent, Typography, Pagination, Badge } from '@mui/material';
import { BadgeUnstyled } from '@mui/base';

import projectJSONData from "../../data/projectData.json"
import Router from "next/router";

import { useSelector, useDispatch } from 'react-redux';
import * as projectActions from '../../store/module/project';
import * as studyActions from '../../store/module/study';

import { getProjectAllAPI, getProjectById } from "../../pages/api/project"

import StackList from "./StackList"
import stackData from "../../data/StackData.json"

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


function ItemList(props) {
    //-------------- redux dispatch로 값 저장, selector로 불러오기
    
    const dispatch = useDispatch();
    
    let clubData, filterData, setDetail, setList;
    
    if (props.from === "project") {
        clubData = useSelector(({ project }) => project.projectList);
        filterData = useSelector(({ project }) => project.projectFilterList);
        setDetail = useCallback(
            ({detail}) => {
                dispatch(projectActions.setProjectDetail({detail}))
            },
            [dispatch],
        )
    
        setList = useCallback(
            ({list}) => {
                dispatch(projectActions.setProjectList({list}))
            },
            [dispatch],
        )
    } else if (props.from === "study") {
        clubData = useSelector(({ study }) => study.studyList);
        setDetail = useCallback(
            ({detail}) => {
                dispatch(studyActions.setStudyDetail({detail}))
            },
            [dispatch],
        )
    
        setList = useCallback(
            ({list}) => {
                dispatch(studyActions.setStudyList({list}))
            },
            [dispatch],
        )
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
    let allPage = parseInt(clubData.length / purPage.current);
    if (clubData.length % purPage.current > 0) allPage += 1;

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

    // 화면에 요소를 그리기 전에 store에 저장된 아이템 리스트가 있는지 확인
    // 없으면 store에 저장
    useLayoutEffect(() => {
        // 빈 배열이면 배열 요청
        // To Do : 나중에 api로 값 가져오게 수정 - Study API 연동 필요
        if (props.from === "project") {
            getProjectAllAPI().then(res => setList({list: res.projects}));
        } else if (props.from === "study") {
            getProjectAllAPI().then(res => setList({list: res.projects}));
        } else {
            setList({list: projectJSONData});
        }
    }, [])

    const handleChange = (index,value) => {
        setPage(value);
    };


    const CusPagination = styled(Pagination)`
        margin-top: 20px;
    `;

    const CusGrid = styled(Grid)`
        min-height: 530px;
    `

    const CusCard = styled(Card)`
        width: 100%;
        padding: 10px;
    `

    return (
        <>
        {
            clubData.length==0?
            <CusGrid>
                <CusCard>등록된 데이터가 없습니다.</CusCard>
            </CusGrid>
            :
            <CusGrid container maxWidth="lg" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4}}>
            {
                // 검색된 데이터가 있을 때
                filterData!=null?
                filterData.slice(purPage.current * (page-1), purPage.current * page).map((data) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
                            <Item data={data} setDetail={setDetail} from={props.from}></Item> 
                        </Grid>
                    )
                })
                :
                clubData.slice(purPage.current * (page-1), purPage.current * page).map((data) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
                            <Item data={data} setDetail={setDetail} from={props.from}></Item> 
                        </Grid>
                    )
                })
            }
        </CusGrid>
        }
        
        <CusPagination count={allPage} color="primary" page={page} onChange={handleChange} />
        </>
    )
}

export function Item(props) {
    let {data, setDetail, from} = props;

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        text-align: left;
    `

    const CusCountBadge = styled(Badge)`
        top: 25px;
        right: 30px;
    ` 

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
        // top: 125px;
        // right: 40px;
    ` 

    let totalSize = 0, currSize = 0;
    data.positions.map((curr) => {
        if (curr.position === "totalSize") totalSize = curr.size;
        if (curr.position === "currentSize") currSize = curr.size;
    })

    return (
        <Container onClick={()=>{
            getProjectById({id: data.id})
            .then(res => {
                setDetail({detail: res.project});
                
                // api 작성
                Router.push({
                    pathname: `/${from}/[id]`,
                    query: { id: data.id }
                })
            })
            
        }}>
            <CusCountBadge badgeContent={currSize+" / "+totalSize} color="primary"></CusCountBadge>
            <CusDeadlineBadge badgeContent={"D-"+ (data.deadline!=0? data.deadline: "DAY" ) + " | ♥ "+data.likes}></CusDeadlineBadge>
            {/* <CusLikeBadge badgeContent={"좋아요 "+data.likes)}></CusLikeBadge> */}

            <Card>
                {
                    // data.file?
                    // <div style={{
                    //     height: "150px",
                    //     backgroundImage: `url("../../../backend-java/${data.file.saveFolder}/${data.file.saveFile}")`
                    // }}></div>
                    // :
                    <Skeleton variant="rectangular" height={150} animation={false} />
                }
                
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {data.title}
                    </Typography>
                    
                    {/* 리스트에서 보이는 클럽 스택은 최대 3개까지 표시 */}
                    <StackList stackData={data.stacks.length > 3? 
                        data.stacks.slice(0,3)
                        : 
                        data.stacks
                }></StackList>
                </CardContent>
            </Card>
        </Container>
    )
}

export default ItemList;