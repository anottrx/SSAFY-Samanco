import { InputBase, IconButton, Paper } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, useCallback } from "react";

import {useDispatch } from 'react-redux';
import * as projectActions from '../../store/module/project';
import * as studyActions from '../../store/module/study';

import {getProjectBytitle} from "../../pages/api/project"
import {getStudyBytitle} from "../../pages/api/study"

function SearchBar(props) {
    const [keyword, setKeyword] = useState("");
    const handleChange = (e) => {
        setKeyword(e.target.value);
    }

    const dispatch = useDispatch();


    useEffect(() => {
        if (keyword !== "")
            console.log(keyword)
        if (props.target === "project") {
            // 프로젝트 페이지를 위한 검색창
            if (!keyword)
                dispatch(projectActions.setProjectFilterList({list: null}))
            else {
                getProjectBytitle(keyword)
                .then(res => 
                    dispatch(projectActions.setProjectFilterList({list: res.projects}))
                )
            }
        } else if (props.target === "study") {
            // 스터디 페이지를 위한 검색창
            if (!keyword)
                dispatch(studyActions.setStudyFilterList({list: null}))
            else {
                getStudyBytitle(keyword)
                .then(res => {
                    console.log(res.studies);
                    dispatch(studyActions.setStudyFilterList({list: res.studies}));
                }
                )
            }
        }
    }, [keyword])

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', alignSelf: "flex-start", width:"100%", maxWidth: 400, justifyContent: "space-between", margin: "10px 0px" }}>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="검색어를 입력해주세요."
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={handleChange}/>
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    )
}

export default SearchBar;