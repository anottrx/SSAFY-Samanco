import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import Cookies from "universal-cookie";
import { useCookies } from "react-cookie";
import {
  getUserLoginTokenAPI,
  getUserInfoAPI,
  updateUserAPI,
  updateNicknameAPI,
  deleteUserAPI,
} from "../../pages/api/user";
import { TextField, Button } from "@mui/material";
import styled from "@emotion/styled";
import StackLevelList from "../Common/Stack/StackLevelList";
import LinkList from "../Common/LinkList";

export default function MyInfo() {
  const [authChange, setAuthChange] = useState(false);
  const [onlyView, setOnlyView] = useState(true);
  const [finishUpdate, setFinishUpdate] = useState(false);
  const [nicknameChange, setNicknameChange] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);

  const [inputState, setInputState] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    nickname: "",
    userClass: "",
    birthday: "",
    generation: "",
    studentId: "",
    stacks: [],
    position: "",
    link: "",
    description: "",
    image_id: "",
  });

  const [nicknameInfo, setNicknameInfo] = useState({
    nickname: "",
    id: sessionStorage.getItem("userId"),
  });

  const cookies = new Cookies();
  const [cookie, setCookie] = useCookies(["userToken"]);

  const [files, setFiles] = useState("");

  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

  async function getUserInfo() {
    // 사용자 정보 가져오는 함수
    const token = cookie.userToken;

    getUserLoginTokenAPI(token).then((res) => {
      if (res.statusCode == 200) {
      } else {
      }
      console.log("getUserLoginTokenAPI 관련 결과" + JSON.stringify(res));
      inputState.userId = res.userId;
      inputState.email = res.email;
      inputState.nickname = res.nickname;

      const userId = res.userId;
      getUserInfoAPI(userId).then((res) => {
        if (res.statusCode == 200) {
        } else {
        }
        console.log("내 정보 보기 결과: " + JSON.stringify(res));
        inputState.name = res.user.name;
        inputState.birthday = res.user.birthday;
        inputState.phone = res.user.phone;
        inputState.userClass = res.user.userClass;
        inputState.generation = res.user.generation;
        inputState.studentId = res.user.studentId;
        inputState.position = res.user.position;
        inputState.password = res.user.password;
        inputState.link = res.user.link;
        inputState.description = res.user.description;
        inputState.stacks = res.user.stacks;

        setLinks(inputState.link.split(" "));
        // inputState.file = res.user.file;
        setLoading(true);
        // ShowStack(inputState.stacks);
      });
    });
  }

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

  useEffect(() => {
    getUserInfo();
    preview();
  }, []);

  const preview = () => {
    if (!files) return false;

    const imgEl = document.querySelector("#img_box");
    const reader = new FileReader();

    reader.onload = () =>
      (imgEl.style.backgroundImage = `url(${reader.result})`);

    imgEl.innerText = "";
    reader.readAsDataURL(files);
  };

  const handleNicknameChange = (e) => {
    setNicknameInfo({
      nickname: e.target.value,
      id: sessionStorage.getItem("userId"),
    });
  };

  const PromptPasswordCheck = (e) => {
    return (
      <>
        <div id="dialog" title="Basic dialog">
          <input
            id="password"
            value={inputState.password}
            type="password"
            onChange={handleChange}
            size="25"
          />
        </div>
      </>
    );
  };

  const handleNicknameClick = (e) => {
    e.preventDefault();
    // 닉네임 바꿀 수 있는지 확인
    if (nicknameChange) {
      let isNormal = true;
      if (
        nicknameInfo.nickname == "" ||
        nicknameInfo.nickname == "admin" ||
        nicknameInfo.nickname == "관리자"
      ) {
        isNormal = false;
      }

      if (isNormal) {
        updateNicknameAPI(nicknameInfo).then((res) => {
          console.log("닉네임 수정 가능한지 확인한 결과" + JSON.stringify(res));
          if (res.statusCode == 200) {
            setCheckPassword(true);

            if (window.confirm("닉네임 수정이 가능합니다. 수정하시겠습니까?")) {
              //업데이트 API 실행하기
              const formData = new FormData();
              console.log("inputState" + JSON.stringify(inputState));
              console.log(inputState);

              Object.keys(inputState).map((key) => {
                let value = inputState[key];
                if (key === "stacks") {
                  formData.append(key, "[" + JSON.stringify(value) + "]");
                  // console.log(key + " " + ("["+JSON.stringify(value)+"]"));
                } else {
                  formData.append(key, value);
                  console.log(key + " " + value);
                }
              });

              formData.append("file", files);

              for (let key of formData.entries()) {
                console.log("key", `${key}`);
              }

              updateUserAPI(formData).then((res) => {
                console.log(res);
                console.log(JSON.stringify(res));
                if (res.statusCode == 200) {
                  sessionStorage.clear();
                  sessionStorage.setItem("userId", inputState.userId);
                  sessionStorage.setItem("email", inputState.email);
                  sessionStorage.setItem("nickname", inputState.nickname);
                  setNicknameChange(false);
                } else {
                  alert(
                    "회원정보 추가에 실패했습니다. 에러코드:" + res.statusCode
                  );
                }
              });
            } else {
            }
          } else {
            alert(`${res.message}`);
          }
        });
      }
    } else {
      setNicknameChange(true);
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setOnlyView(false);
    setFinishUpdate(true);

    let isNormal = true;
    let msg = "";

    if (!inputState.password) {
      isNormal = false;
      msg = "비밀번호를 입력해주세요.";
    } else if (!pwReg.test(inputState.password)) {
      isNormal = false;
      msg = "비밀번호 양식을 확인해주세요.";
    } else if (inputState.password != inputState.passwordConfirm) {
      isNormal = false;
      msg = "비밀번호가 동일하지 않습니다.";
    } else if (!phoneReg.test(inputState.phone)) {
      isNormal = false;
      msg = "전화번호 양식을 확인해주세요.";
    } else if (!inputState.nickname) {
      isNormal = false;
      msg = "닉네임을 입력해주세요.";
    }

    if (isNormal) {
      // updateUserAPI(inputState).then((res) => {
      if (res.statusCode == 200) {
        setAuthChange(true);
        setOnlyView(false);
        setFinishUpdate(true);
        // } else alert(`${res.message}`);
        // });
      } else {
        alert(msg);
      }
    }
  };

  const handleUpdateFinishClick = (e) => {
    setAuthChange(false);
    setOnlyView(true);
    setFinishUpdate(false);
  };

  const handleQuitClick = (event) => {
    const userId = sessionStorage.getItem("userId");
    if (window.confirm("탈퇴하시겠습니까?")) {
      deleteUserAPI(userId).then((res) => {
        if (res.statusCode == 200) {
          // 탈퇴 성공 시
          alert("다음에는 오프라인에서 함께 코딩해요!");
          sessionStorage.clear();
          cookies.set("userToken", "");
          cookies.set("userEmail", "");
          // 페이지 이동
          window.history.forward();
          document.location.href = "/";
        } else alert(`${res.message}`);
      });
    } else {
      alert("좋아요! 싸피사만코와 오래오래 코딩해요!");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <div>
      {loading ? (
        <div>
          <div>
            <h1>내정보</h1>
            {finishUpdate ? (
              <button onClick={handleUpdateFinishClick}>수정완료</button>
            ) : (
              <button onClick={handleUpdateClick}>수정하기</button>
            )}
            <div className="mb-6">
              <label>이메일</label>
              <input
                id="email"
                type="email"
                disabled
                value={inputState.email || ""}
              />
            </div>
            <div className="mb-6">
              <label>닉네임</label>
              <input
                id="nickname"
                value={inputState.nickname || ""}
                disabled={nicknameChange ? false : true}
                // disabled={onlyView ? true : false}
                onChange={(e) => {
                  handleNicknameChange(e);
                  handleChange(e);
                }}
              />
              {nicknameChange ? (
                <button onClick={handleNicknameClick}>수정완료</button>
              ) : (
                <button onClick={handleNicknameClick}>수정하기</button>
              )}
            </div>
            <div className="mb-6">
              <label>기수</label>
              <input value={inputState.generation || ""} disabled />
            </div>
            <div className="mb-6">
              <label>반</label>
              <input
                id="userClass"
                value={inputState.userClass || ""}
                disabled={onlyView ? true : false}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label>학번</label>
              <input value={inputState.studentId || ""} disabled />
            </div>
            <div className="mb-6">
              <label>이름</label>
              <input
                value={inputState.name || ""}
                disabled
              />
            </div>
            <div className="mb-6">
              <label>분야</label>
              <input
                id="position"
                value={inputState.position || ""}
                disabled={onlyView ? true : false}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label>생년월일</label>
              <input value={inputState.birthday || ""} disabled />
            </div>
            <div className="mb-6">
              <label>전화번호</label>
              <input
                id="phone"
                value={inputState.phone || ""}
                disabled={onlyView ? true : false}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label>링크</label>
              {/* <input
                id="link"
                value={inputState.link || ""}
                disabled={onlyView ? true : false}
                onChange={handleChange}
              /> */}
               <LinkList items={links} />
            </div>
            <div className="mb-6">
              <label>스택</label>
              <StackLevelList  items={inputState.stacks} />
            </div>
            <div className="mb-6">
              <label>자기소개</label>
              <br />
              <TextField
                id="description"
                placeholder="자기자신에 대해 소개해주세요"
                // fullWidth
                rows={4}
                multiline
                value={inputState.description || ""}
                disabled={onlyView ? true : false}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label>이미지</label>
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
            </div>
          </div>
          <button onClick={handleQuitClick}>탈퇴하기</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
