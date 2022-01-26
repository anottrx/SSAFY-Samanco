import React, { useState, useEffect } from "react";
import userData from "../../data/userData.json";
import Router from "next/router";
import Cookies from "universal-cookie";
import { useCookies } from "react-cookie";
import {
  getUserTokenAPI,
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
    newNickname: "",
    curUserId: "",
  });

  const cookies = new Cookies();
  const [cookie, setCookie] = useCookies(["userToken"]);

  const token = cookie.userToken;
  const [uesrIdNum, setUserIdNum] = useState("");
  async function getUserToken() {
    getUserTokenAPI(token).then((res) => {
      // console.log("token: " + token);
      // console.log("res: " + res);

      if (res.statusCode == 200) {
      } else {
        alert(`${res.email}`);
      }
      console.log("getUserToken" + res);

      setInputState({
        userId: res.userId,
        email: res.email,
        nickname: res.nickname,
      });
      setUserIdNum({
        userIdNum: res.userId,
      });
      setNicknameInfo({
        curUserId: res.userId,
      });
    });
  }

  async function getUserInfo() {
    setUserIdNum({
      userIdNum: sessionStorage.getItem("userId"),
    });
    console.log("UserID는 " + sessionStorage.getItem("userId"));
    getUserInfoAPI("45").then((res) => {
      if (res.statusCode == 200) {
      } else {
        alert(`${res.email}`);
      }
      console.log("getUserInfoAPI" + res.user);

      setInputState({
        phone: res.phone,
        class: res.class,
        birthday: res.birthday,
        generation: res.generation,
        studentId: res.studentId,
        stacks: res.stacks,
        position: res.position,
        link: res.link,
        description: res.description,
        image_id: res.image_id,
      });
      setNicknameInfo({
        curUserId: res.userId,
      });
    });
  }

  useEffect(() => {
    // getUserToken();
    getUserInfo();
    console.log(
      inputState.userId + " " + inputState.email + " " + inputState.nickname
    );
  }, []);

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

  const handleNicknameChange = (e) => {
    setNicknameInfo({
      newNickname: e.target.value,
    });
  };
  const handleNicknameClick = (e) => {
    e.preventDefault();
    // 닉네임 바꾸기
    if (nicknameChange) {
      // setNicknameChange(false);
      setNicknameInfo({
        curUserId: inputState.userId,
      });

      let isNormal = true;
      if (nicknameInfo.newNickname == "") {
        isNormal = false;
      }
      if (isNormal) {
        updateNicknameAPI(nicknameInfo).then((res) => {
          console.log(
            "닉네임 업데이트할 때 입력값" +
              nicknameInfo.newNickname +
              " " +
              nicknameInfo.curUserId
          );
          if (res.statusCode == 200) {
            setNicknameChange(false);
          } else {
            alert(`${res.message}`);
          }
          console.log("닉네임 업데이트결과" + res);
        });
      }
    } else {
      setNicknameChange(true);
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
          <input value={inputState.class || ""} disabled />
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
