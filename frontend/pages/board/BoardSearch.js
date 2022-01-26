import { InputBase, IconButton, Paper } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, useCallback } from "react";
import {useDispatch } from 'react-redux';


function BoardSearch(props) {
    const [keyword, setKeyword] = useState("");
    const handleChange = (e) => {
        setKeyword(e.target.value);
    }


    useEffect(() => {
        console.log(keyword)
        if (props.target === "board" && keyword) {
        }
    }, [keyword])

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', alignSelf: "flex-start", width:"100%", maxWidth: 400, justifyContent: "space-between", margin: "10px 0px" }}>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="검색어를 입력해주세요."
                onChange={handleChange}/>
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    )
}

export default BoardSearch;