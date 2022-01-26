import React, { useState, useEffect } from "react";
import userData from "../../data/userData.json";
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
import { TextField } from "@mui/icons-material";

export default function MyInfo() {
  const [authChange, setAuthChange] = useState(false);
  const [onlyView, setOnlyView] = useState(true);
  const [finishUpdate, setFinishUpdate] = useState(false);
  const [nicknameChange, setNicknameChange] = useState(false);

  const [inputState, setInputState] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    nickname: "",
    class: "",
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

  useEffect(() => {
    const token = cookie.userToken;

    getUserLoginTokenAPI(token).then((res) => {
      if (res.statusCode == 200) {
      } else {
      }
      console.log("getUserLoginTokenAPI 관련 결과" + JSON.stringify(res));
      // setInputState({
      //   userId: res.userId,
      //   email: res.email,
      //   nickname: res.nickname,
      // });
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
        inputState.class = res.user.userClass;
        inputState.generation = res.user.generation;
        inputState.studentId = res.user.studentId;
        inputState.position = res.user.projectPosition;
        inputState.password = res.user.password;
        // inputState.link = res.user.user.link;
        inputState.description = res.description;
        // inputState.stacks = res.user.stacks;
        // inputState.file = res.user.file;
      });
    });
  }, []);

  const handleNicknameChange = (e) => {
    setNicknameInfo({
      nickname: e.target.value,
      id: sessionStorage.getItem("userId"),
    });
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
        // console.log(nicknameInfo);
        updateNicknameAPI(nicknameInfo).then((res) => {
          if (res.statusCode == 200) {
            setNicknameChange(false);
            // sessionStorage.setItem("nickname", nicknameInfo.nickname);
          } else {
            alert(`${res.message}`);
          }
          console.log("닉네임 수정 가능한지 확인한 결과" + JSON.stringify(res));
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
    <>
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
            value={inputState.class || ""}
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
          <input value={inputState.name || ""} disabled />
        </div>
        <div className="mb-6">
          <label>분야</label>
          <input
            id="position"
            defaultValue={inputState.position || ""}
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
            defaultValue={inputState.phone || ""}
            disabled={onlyView ? true : false}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label>링크</label>
          <input
            id="link"
            defaultValue={inputState.link || ""}
            disabled={onlyView ? true : false}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label>스택</label>
          {/* {stacks.map((item) => {
            if (item.HTML > 0) {
              console.log("dd")
            }
          })} */}
        </div>
        <div className="mb-6">
          <label>자기소개</label>
          {/* <TextField
            id="outlined-textarea"
            placeholder="자기자신에 대해 소개해주세요"
            fullWidth
            rows={4}
            multiline
            value={inputState.description}
            disabled={onlyView ? true : false}/> */}
        </div>
        <div className="mb-6">
          <label>이미지</label>
          {/* <text>{image_id}</text> */}
        </div>
      </div>
      <button onClick={handleQuitClick}>탈퇴하기</button>
    </>
  );
}
