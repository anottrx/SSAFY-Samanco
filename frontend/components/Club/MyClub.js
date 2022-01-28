import {Card, CardContent, Button} from "@mui/material";
import styled from "@emotion/styled";
import * as projectActions from '../../store/module/project';
import { useSelector, useDispatch } from 'react-redux';
import {getProjectByUserId} from "../../pages/api/project"
import { useEffect, useCallback } from "react";

import StackList from "../Club/StackList"
import Router from "next/router";


function MyClub(props){
    const MyClubWrapper = styled.div`
        width: 100%;
        & .img-wrapper{
            background-Color: #c9c9c9;
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }
    `

    const CusCardContent = styled(CardContent)`
        display: flex;
        flex-direction: row;
    `

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
            color: #1976D6;
        }
    `

    const CusCard = styled(Card)`
        max-width: 430px;
    `

    const dispatch = useDispatch();
    let clubData;
    if (props.from === "project") {
        clubData = useSelector(({ project }) => project.myProject);
    }

    useEffect(() => {
        getProjectByUserId(sessionStorage.getItem("userId"))
        .then(res => dispatch(projectActions.setMyProject({project: res.project})));
    }, [])

    return (
        typeof(clubData) === "undefined"?
        null : 
        <MyClubWrapper>
            <h2>{props.label}</h2>
            <CusCard>
                <CusCardContent>
                    <div className="img-wrapper"></div>
                    <ProjectInfo>
                        <div className="title">{clubData.title}</div>
                        <div className="date">{clubData.startDate} ~ {clubData.endDate}</div>
                        
                        {/* 리스트에서 보이는 클럽 스택은 최대 3개까지 표시 */}
                        <StackList stackData={clubData.stacks.length > 3? 
                            clubData.stacks.slice(0,3)
                            : 
                            clubData.stacks
                        }></StackList>
                        <Button variant="outlined" onClick={() => {
                            Router.push("/project/info")
                        }}>상세 보기 </Button>
                    </ProjectInfo>
                    
                </CusCardContent>
            </CusCard>
        </MyClubWrapper>
    )
}

export default MyClub;