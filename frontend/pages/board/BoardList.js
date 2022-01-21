import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Data from "./data.js";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
},
[`&.${tableCellClasses.body}`]: {
    fontSize: 14,
},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
// hide last border
'&:last-child td, &:last-child th': {
    border: 0,
},
}));

export default function BoardList(props) {
    let [articles,setArticles] = useState(Data);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>제목</StyledTableCell>
                        <StyledTableCell align="right">아이디</StyledTableCell>
                        <StyledTableCell align="right">날짜</StyledTableCell>
                        <StyledTableCell align="right">좋아요</StyledTableCell>
                        <StyledTableCell align="right">조회수</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {articles.map((article) => (
                        article.tag === props.tag
                        ? <StyledTableRow key={article.board_id}>
                        <StyledTableCell component="th" scope="row">
                            {article.title}
                        </StyledTableCell>
                        <StyledTableCell align="right">{article.user_id}</StyledTableCell>
                        <StyledTableCell align="right">{article.start_date}</StyledTableCell>
                        <StyledTableCell align="right">{article.likes}</StyledTableCell>
                        <StyledTableCell align="right">{article.hit}</StyledTableCell>
                        </StyledTableRow>
                        :null
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack spacing={2}>
                <Pagination count={10} size="large" />
            </Stack>
        </div>
    );
}