import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';

import Router from 'next/router';
import * as userActions from '../../store/module/user';
// import style from '@emotion/styled';
import { getAllUserInfoAPI } from '../../pages/api/user';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#A2C2DC',
    color: theme.palette.common.black,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function AdminList() {
  const dispatch = useDispatch();

  let setUsers, userData, setDetail;

  userData = useSelector(({ user }) => user.userList);
  // console.log(userData)

  //  setDetail = useCallback(
  //       ({detail}) => {
  //           dispatch(boardActions.setBoardDetail({detail}))
  //       },
  //       [dispatch],
  //   )

  setUsers = useCallback(
    ({ list }) => {
      dispatch(userActions.setUserList({ list }));
    },
    [dispatch]
  );

  useLayoutEffect(() => {
    getAllUserInfoAPI().then((res) => {
      setUsers({ list: res.users });
    });
  }, []);

  useEffect(() => {
    getAllUserInfoAPI().then((res) => {
      setUsers({ list: res.users });
    });
  }, []);

  const [page, setPage] = useState(1);
  const purPage = useRef(10);
  let allPage = 1;

  if (userData) {
    allPage = parseInt(userData.length / purPage.current);
    if (userData.length % purPage.current > 0) allPage += 1;
  }

  const handleChange = (index, value) => {
    setPage(value);
  };

  const CusPagination = styled(Pagination)`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  `;

  return (
    <>
      <TableContainer>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>이메일</StyledTableCell>
              <StyledTableCell align="right">닉네임</StyledTableCell>
              <StyledTableCell align="right">기수 반</StyledTableCell>
              {/* <StyledTableCell align="right">가입일</StyledTableCell>
                        <StyledTableCell align="right">계정상태</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {!userData || userData.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell>이용자가 없습니다</StyledTableCell>
              </StyledTableRow>
            ) : (
              <>
                {typeof filterData !== 'undefined' && filterData !== null ? (
                  <Users userInfo={filterData}></Users>
                ) : (
                  <Users userInfo={userData}></Users>
                )}
              </>
            )}
          </TableBody>
        </Table>
        <CusPagination
          count={allPage}
          color="primary"
          page={page}
          onChange={handleChange}
        />
      </TableContainer>
    </>
  );

  function Users({ userInfo }) {
    return userInfo
      .slice(purPage.current * (page - 1), purPage.current * page)
      .map((data) => {
        return (
          <StyledTableRow
            key={data.id}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // setDetail({detail: data});
              // Router.push("/board/"+data.boardId);
              sessionStorage.setItem('userInfo', data.id);
              Router.push('/admin/userinfo');
            }}
          >
            <StyledTableCell component="th" scope="row">
              {`${data.email}`}
            </StyledTableCell>
            <StyledTableCell align="right">{data.nickname}</StyledTableCell>
            <StyledTableCell align="right">
              {data.generation}기 {data.userClass}반
            </StyledTableCell>
            {/* <StyledTableCell align="right">{data.likes}</StyledTableCell>
                    <StyledTableCell align="right">{data.hit}</StyledTableCell> */}
          </StyledTableRow>
        );
      });
  }
}
