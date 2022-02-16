import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { useCookies } from 'react-cookie';
import {
  getUserInfoAPI,
  deleteUserAPI,
} from '../../pages/api/user';
import DatePickerUser from '../../components/Common/DatePickerUser';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Container from '@mui/material/Container';
import Swal from 'sweetalert2';

import styled from '@emotion/styled';
import StackLevelListInfo from '../Common/Stack/StackLevelListInfo';
import StackLevelSelectRegister from '../Common/Stack/StackLevelSelectRegister';
import LinkList from '../Common/LinkList';
import StackLevelInfoDialog from '../Common/Stack/StackLevelInfoDialog';

const DatePickerWrapper = styled.div`
  display: flex;
  & > div {
    flex: 1;
    width: 370px;
    margin: 0px 0px;
  }
`;
const CusCard = styled(Card)`
  // margin-top: 10px;
  padding: 10px;

  // display: flex;
  margin: 10px 0px;
  align-items: center;

  & h4 {
    font-weight: bolder;
    padding: 0;
    margin: 0;
  }
`;
const CusContainer = styled(Container)`
  float: left;
`;
const ImgUploadBtn = styled(Button)`
  padding: 20px;
  border: 1px dashed grey;
  min-width: 150px;
  min-height: 150px;
  margin: 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
`;
const ImgDefault = styled.img`
  // padding: 20px;
  // border: 1px dashed grey;
  min-width: 150px;
  min-height: 150px;
  max-width: 180px;
  margin: 0px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
`;
const DetailWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  // align-items: baseline;

  & > div {
    // display: flex;
    // margin-left: auto;
    // float: right;
  }

  & div > p {
    margin-left: 10px;
  }

  & .dateOrTime {
    color: gray;
  }
`;
const CusSkeleton = styled.div`
  // display: flex;
  flex: 1;
  min-width: 250px;
  min-height: 200px;
  height: auto;
`;
const ContentUpWrapper = styled.div`
  display: flex;
  max-width: 800px;
  flex-direction: column;
`;
const ContentWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  flex: 1;
  max-width: 800px;
`;
const ButtonWrapper = styled.div`
  flex: 1;
  max-width: 800px;
`;
const RowUpWrapper = styled.div`
  display: grid;
  // grid-template-columns: max-content max-content;
  grid-template-columns: 60px 12fr;
  grid-gap: 8px;
  padding: 2px 0px;
`;
const RowWrapper = styled.div`
  display: grid;
  // grid-template-columns: max-content max-content;
  grid-template-columns: 60px 12fr;
  grid-gap: 8px;
  padding: 2px 0px;
`;

export default function UserInfoPage() {
  const adminUserId = useSelector(({ user }) => user.adminUserId);

  const [authChange, setAuthChange] = useState(false);
  const [onlyView, setOnlyView] = useState(true);
  const [finishUpdate, setFinishUpdate] = useState(false);
  const [nicknameChange, setNicknameChange] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [reloadCondition, setReloadCondition] = useState(false);

  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [imageDefault, setImageDefault] = useState('');

  const [inputState, setInputState] = useState({
    userId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    nickname: '',
    class: '',
    birthday: '',
    initDate: '',
    generation: '',
    studentId: '',
    stacks: [],
    stacks_get: [],
    position: '',
    link: '',
    description: '',
    image_id: '',
  });

  const positionOptions = [
    { value: '', name: '선택해 주세요' },
    { value: 'frontend', name: '프론트엔드' },
    { value: 'backend', name: '백엔드' },
    { value: 'mobile', name: '모바일' },
    { value: 'embedded', name: '임베디드' },
  ];

  const classOptions = [
    { value: 'JAVA', name: '자바반' },
    { value: 'PYTHON', name: '파이썬반' },
    { value: 'MOBILE', name: '모바일반' },
    { value: 'EMBEDDED', name: '임베디드반' },
  ];

  const [nicknameInfo, setNicknameInfo] = useState({
    nickname: '',
    id: sessionStorage.getItem('userInfo'),
  });

  const cookies = new Cookies();
  const [cookie, setCookie] = useCookies(['userToken']);

  const [files, setFiles] = useState('');

  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

  const [userBirthday, setUserBirthday] = useState({
    value: '',
    initDate: '',
  });
  const [userBirthdayDate, setUserBirthdayDate] = useState('');

  async function getUserInfo() {
    // 사용자 정보 가져오는 함수
    getUserInfoAPI(adminUserId).then((res) => {
      if (res.statusCode == 200) {
        inputState.email = res.user.email;
        inputState.nickname = res.user.nickname;
        nicknameInfo.nickname = res.user.nickname;
        inputState.name = res.user.name;
        const today = new Date();
        const todayYear = today.getFullYear().toString().slice(2);
        if (res.user.birthday != null) {
          inputState.birthday = res.user.birthday;
          inputState.initDate = res.user.birthday;
          let year = inputState.birthday.slice(0, 2);
          year = Number(year) > 25 ? 19 + year : 20 + year;
          let month = inputState.birthday.slice(2, 4);
          let day = inputState.birthday.slice(4, 6);
          setUserBirthdayDate(year + '-' + month + '-' + day);
          userBirthday.initDate = year + '-' + month + '-' + day;
          userBirthday.value = year + '-' + month + '-' + day;
        }
        inputState.class = res.user.userClass;
        inputState.generation = res.user.generation;
        inputState.studentId = res.user.studentId;
        inputState.position = res.user.position;
        inputState.password = res.user.password;
        inputState.link = res.user.link;
        inputState.description = res.user.description;
        inputState.stacks = res.user.stacks;
        inputState.stacks_get = res.user.stacks;
        inputState.image_id = res.user.file;

        if (inputState.image_id == null) {
          if (inputState.generation == 7) {
            setImageDefault('/images/profile_default_gen7.png');
          } else if (inputState.generation == 0) {
            setImageDefault('/images/profile_default_gen0.png');
          } else {
            setImageDefault('/images/profile_default_gen6.png');
          }
        }

        if (res.user.link != null) {
          setLinks(inputState.link.split(' '));
        } else {
          setLinks();
        }
        setLoading(true);
      } else {
        //
      }
    });
  }

  useEffect(() => {
    getUserInfo();
    preview();
  }, []);

  useEffect(() => {
    if (reloadCondition) {
      getUserInfo();
      preview();
      setReloadCondition(false);
    }
  }, [reloadCondition]);

  const preview = () => {
    if (!files) return false;

    const imgEl = document.querySelector('#img_box');
    const reader = new FileReader();

    reader.onload = () =>
      (imgEl.style.backgroundImage = `url(${reader.result})`);

    imgEl.innerText = '';
    reader.readAsDataURL(files);
  };

  const [checkedNickname, setCheckedNickname] = useState(true);
  const [changeNickname, setChangeNickname] = useState(false);

  const handleQuitClick = (event) => {
    Swal.fire({
      title: adminUserId + '번 회원을 탈퇴시키겠습니까? 확인 버튼을 누르면 해당 회원은 즉시 탈퇴됩니다',
      text: '탈퇴 취소는 할 수 없으니 신중하게 결정해주세요',
      icon: 'warning',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '해당 회원의 탈퇴 처리 중입니다',
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
            deleteUserAPI(adminUserId).then((res) => {
              if (res.statusCode == 200) {
                // 탈퇴 성공 시
                Swal.fire({
                  title: '탈퇴시켰습니다',
                  text: '회원관리 목록으로 이동합니다',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 500,
                }).then(() => {
                  sessionStorage.setItem('userInfo', '');
                  window.history.forward();
                  document.location.href = '/admin';
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: '탈퇴 처리 중 문제가 발생했습니다',
                  confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                });
              }
            });
          },
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: '탈퇴 처리를 취소했습니다',
          showConfirmButton: false,
          timer: 500,
        });
      }
    });
  };

  return (
    <CusContainer maxWidth="md">
      <CusCard>
        {loading ? (
          <div>
            <CardContent>
              <h1>{inputState.name}님</h1>
              <ContentUpWrapper>
                <Divider light sx={{ marginTop: 1.5, marginBottom: 1 }} />
                <div>
                  <DetailWrapper maxWidth="sm">
                    <CardContent sx={{ width: '60%', marginRight: 5 }}>
                      <Box
                        className="ssafyInfo"
                        sx={{ width: '100%', fontSize: '18px', mb: 1 }}
                      >
                        싸피&nbsp;
                        <label>{inputState.generation}기&nbsp;</label>
                        {onlyView ? (
                          <label>{inputState.class}반&nbsp;</label>
                        ) : (
                          <Select
                            id="class"
                            defaultValue={classOptions[0].value}
                            value={classOptions.value}
                            sx={{ width: 120, fontSize: 14, height: 35 }}
                          >
                            {classOptions.map((opt) => {
                              return (
                                <MenuItem
                                  key={opt.value}
                                  value={opt.value}
                                  sx={{ minWidth: 120, fontSize: 14 }}
                                >
                                  {opt.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                        <label>(학번 {inputState.studentId})</label>
                      </Box>
                      <RowUpWrapper>
                        <label>이메일</label>
                        <input value={inputState.email || ''} disabled />
                      </RowUpWrapper>
                      <RowUpWrapper>
                        <label>닉네임</label>
                        {onlyView ? (
                          <>
                            <input
                              id="nickname"
                              value={nicknameInfo.nickname || ''}
                              disabled={
                                onlyView ? true : changeNickname ? false : true
                              }
                            />
                          </>
                        ) : (
                          <>
                            <OutlinedInput
                              id="nickname"
                              value={nicknameInfo.nickname || ''}
                              disabled={
                                onlyView ? true : changeNickname ? false : true
                              }
                              sx={{ height: 35 }}
                              endAdornment={
                                <InputAdornment position="end">
                                  {finishUpdate ? (
                                    nicknameChange ? (
                                      <Button
                                        variant="outlined"
                                        sx={{ width: '100px' }}
                                      >
                                        중복 확인하기
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        sx={{ width: '100px' }}
                                      >
                                        닉네임 변경하기
                                      </Button>
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </InputAdornment>
                              }
                            />
                          </>
                        )}
                      </RowUpWrapper>
                      <RowWrapper>
                        <label>생년월일</label>
                        {onlyView ? (
                          <input value={userBirthday.value} disabled />
                        ) : (
                          <LocalizationProvider dateAdapter={DateAdapter}>
                            <DatePickerWrapper>
                              <DatePickerUser
                                value={userBirthday || ''}
                                label=""
                              ></DatePickerUser>
                            </DatePickerWrapper>
                          </LocalizationProvider>
                        )}
                      </RowWrapper>
                      <RowWrapper>
                        <label>전화번호</label>
                        <input
                          id="phone"
                          type="number"
                          placeholder={onlyView ? '' : '01012345678'}
                          value={inputState.phone || ''}
                          disabled={onlyView ? true : false}
                        />
                      </RowWrapper>
                      <RowWrapper>
                        <label>분야</label>
                        <input
                          id="position"
                          disabled
                          value={
                            inputState.position == ''
                              ? ''
                              : positionOptions
                                  .map((u, i) => {
                                    if (u.value == inputState.position) {
                                      return u.name;
                                    }
                                  })
                                  .join('')
                          }
                        />
                      </RowWrapper>
                    </CardContent>
                    {onlyView && inputState.file == null ? (
                      <ImgDefault src={imageDefault}></ImgDefault>
                    ) : (
                      <CusSkeleton>
                        <ImgUploadBtn
                          id="img_box"
                          onClick={(event) => {
                            event.preventDefault();
                            uploadRef.current.click();
                          }}
                        >
                          Image Upload
                        </ImgUploadBtn>
                        <input
                          ref={uploadRef}
                          type="file"
                          className="imgInput"
                          id="projectImg"
                          accept="image/*"
                          name="file"
                          encType="multipart/form-data"
                          onChange={onImgChange}
                        ></input>
                      </CusSkeleton>
                    )}
                  </DetailWrapper>
                </div>
                <ContentWrapper2>
                  <CardContent>
                    <label>기술 스택</label>
                    <StackLevelInfoDialog />
                    {onlyView && inputState.stacks_get != null ? (
                      <StackLevelListInfo items={inputState.stacks_get} />
                    ) : (
                      <StackLevelSelectRegister
                        values={(inputState.stacks, inputState.stacks_get)}
                      />
                    )}
                  </CardContent>
                  <CardContent>
                    <label>자기소개</label>
                    <br />
                    <TextField
                      id="description"
                      fullWidth
                      rows={4}
                      multiline
                      value={inputState.description || ''}
                      disabled={onlyView ? true : false}
                    />
                  </CardContent>
                  <CardContent>
                    <label>링크</label>&nbsp;
                    <LinkList items={links} />
                  </CardContent>
                </ContentWrapper2>
                {finishUpdate ? (
                  <></>
                ) : (
                  <ButtonWrapper>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ float: 'right' }}
                      onClick={handleQuitClick}
                    >
                      탈퇴시키기
                    </Button>
                  </ButtonWrapper>
                )}
              </ContentUpWrapper>
            </CardContent>
          </div>
        ) : (
          <></>
        )}
      </CusCard>
    </CusContainer>
  );
}
