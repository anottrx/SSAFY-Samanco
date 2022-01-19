import React, { useState } from "react";
import {
  registAPI,
  idCheckAPI,
  sendEmailCodeAPI,
  checkCodeAPI,
  checkNicknameAPI,
  checkMemberAPI,
} from "../../pages/api/user";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Regist() {
  // id, password 유효성 검사 반환 결과 : idCheckRes, pwCheckRes
  const [idCheckRes, setIdCheckRes] = useState(null);
  const [pwCheckRes, setPwCheckRes] = useState(null);
  const [pwSameRes, setPwSameRes] = useState(null);

  const [nicknameCheckRes, setNicknameCheckRes] = useState(null); // 닉네임 중복검사

  const [authFin, setAuthFin] = useState(false);
  const [emailCodeRes, setEmailCodeRes] = useState(null);
  const [emailCodeCompareRes, setEmailCodeCompareRes] = useState(null);
  const [showEmailCodeCheck, setShowEmailCodeCheck] = useState(false);
  const [calendarShow, setCalendarShow] = useState(true);

  const [inputState, setInputState] = useState({
    id: "",
    name: "",
    password: "",
    passwordConfirm: "",
    code: "",
    email: "",
    phone: "",
    nickname: "",
    class: "",
    birthday: "",
    generation: "",
    student_id: "",
    stack_id: "",
    position: "",
    link: "",
    description: "",
    image_id: "",
  });

  const generationOptions = [
    { value: "1", name: "1기" },
    { value: "2", name: "2기" },
    { value: "3", name: "3기" },
    { value: "4", name: "4기" },
    { value: "5", name: "5기" },
    { value: "6", name: "6기" },
    { value: "7", name: "7기" },
  ];

  const classOptions = [
    { value: "JAVA", name: "자바반" },
    { value: "PYTHON", name: "파이썬반" },
    { value: "MOBILE", name: "모바일반" },
    { value: "EMBEDDED", name: "임베디드반" },
  ];

  const positionGroup = [
    { value: "JAVA", label: "자바반" },
    { value: "PYTHON", label: "파이썬반" },
    { value: "MOBILE", label: "모바일반" },
    { value: "EMBEDDED", label: "임베디드반" },
  ];

  const stackGroup = [
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "VueJS", label: "VueJS" },
    { value: "React", label: "React" },
    { value: "Angular", label: "Angular" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C", label: "C/C++" },
    { value: "Spring boot", label: "Spring boot" },
    { value: "MySQL", label: "MySQL" },
    { value: "Git", label: "Git" },
    { value: "AWS", label: "AWS" },
    { value: "Docker", label: "Docker" },
    { value: "Linux", label: "Linux" },
    { value: "Jira", label: "Jira" },
    { value: "Django", label: "Django" },
    { value: "Redis", label: "Redis" },
  ];

  const SelectGenerationBox = (props) => {
    const genHandleChange = (e) => {
      setInputState({
        ...inputState,
        generation: e.target.value,
      });
      console.log(inputState.generation);
    };
    return (
      <select onChange={genHandleChange}>
        {props.options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            defaultValue={props.defaultValue === option.value}
          >
            {option.name}
          </option>
        ))}
      </select>
    );
  };

  const SelectClassBox = (props) => {
    const classHandleChange = (e) => {
      // console.log(e.target.value);
    };
    return (
      <select onChange={classHandleChange}>
        {props.options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            defaultValue={props.defaultValue === option.value}
          >
            {option.name}
          </option>
        ))}
      </select>
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const idHandleChange = (e) => {
    const value = e.target.value;
    idCheckAPI(value).then((res) => {
      setIdCheckRes({ code: res.statusCode, msg: res.message });
    });
  };

  const nicknameHandleChange = (e) => {
    const value = e.target.value;
    checkNicknameAPI(value).then((res) => {
      setNicknameCheckRes({ code: res.statusCode, msg: res.message });
    });
  };

  const sendEmailCodeClick = (e) => {
    // 이메일로 인증번호 보내기 + 인증번호 입력 받을 수 있게 폼 열기
    e.preventDefault();
    const value = inputState.email;

    if (!inputState.email) {
      alert("이메일을 입력해주세요.");
    } else if (!emailReg.test(inputState.email)) {
      alert("이메일 양식을 확인해주세요.");
    } else {
      //   console.log(value);
      //   setCookie("emailAuth",  new Date().getTime()); // 쿠키 설정
      //   sendEmailCodeAPI(value).then((res) => {
          setShowEmailCodeCheck(true);
          setAuthFin(false);
      //   });
    }
  };

  const compareEmailCodeClick = (e) => {
    // 이메일로 받은 인증번호 입력해서 확인하기 + 확인 완료되면 폼 닫고 이메일 입력 못 받게 바꾸기
    e.preventDefault();
    const value = inputState.code;

    if (!inputState.code) {
      alert("인증번호를 입력해주세요.");
    } else {
      // console.log(value);
      //   checkEmailPWAPI(value).then((res) => {
      //     setEmailCodeRes({ code: res.statusCode, msg: res.message });
      setShowEmailCodeCheck(false);
      setAuthFin(true);
      //   });
    }
  };

  const showCalendarClick = (e) => {
    e.preventDefault();
  };

  const pwHandleChange = (e) => {
    const value = e.target.value; // 입력한 값
    setPwCheckRes(
      pwReg.test(value)
        ? { code: 200, msg: "사용 가능한 비밀번호입니다." }
        : {
            code: 401,
            msg: "비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요.",
          }
    );
  };

  const pwSameCheck = (e) => {
    const value = e.target.value;
    setPwSameRes(inputState.password == value ? true : false);
  };

  const idReg = /^[A-Za-z0-9_-]{4,8}$/;
  // 아이디 정규표현식 : 최소 4자, 최대 8자

  const pwReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{8,16}$/;
  // 비밀번호 정규표현식 : 최소 8자, 최대 16자, 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자

  const emailReg =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  // 이메일 정규표현식

  const phoneReg = /^[0-9]{8,13}$/;
  // 전화번호 정규표현식

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = "";

    if (!inputState.id) {
      isNormal = false;
      msg = "아이디를 입력해주세요.";
    } else if (!idReg.test(inputState.id)) {
      isNormal = false;
      msg = "아이디의 양식을 확인해주세요.";
    } else if (!inputState.password) {
      isNormal = false;
      msg = "비밀번호를 입력해주세요.";
    } else if (!pwReg.test(inputState.password)) {
      isNormal = false;
      msg = "비밀번호 양식을 확인해주세요.";
    } else if (inputState.password != inputState.passwordConfirm) {
      isNormal = false;
      msg = "비밀번호가 동일하지 않습니다.";
    } else if (!inputState.name) {
      isNormal = false;
      msg = "이름을 입력해주세요.";
    } else if (!inputState.email) {
      isNormal = false;
      msg = "이메일을 입력해주세요.";
    } else if (!emailReg.test(inputState.email)) {
      isNormal = false;
      msg = "이메일 양식을 확인해주세요.";
    } else if (!inputState.phone) {
      isNormal = false;
      msg = "전화번호를 입력해주세요.";
    } else if (!phoneReg.test(inputState.phone)) {
      isNormal = false;
      msg = "전화번호 양식을 확인해주세요.";
    } else if (!inputState.name) {
      isNormal = false;
      msg = "이름을 입력해주세요.";
    } else if (!inputState.nickname) {
      isNormal = false;
      msg = "닉네임을 입력해주세요.";
    } else if (!inputState.student_id) {
      isNormal = false;
      msg = "학번을 입력해주세요.";
    } else {
      isNormal = true;
    }

    if (isNormal) {
      registAPI(inputState).then((res) => {
        if (res.statusCode == 200) {
          // 가입 성공 시
          alert("가입이 되었습니다!");
          // 페이지 이동
          navigate("/login", { replace: true });
        } else alert(`${res.message}`);
      });
    } else {
      alert(msg);
    }
  };

  const CheckEmailCode = () => (
    <div>
      <label className="">인증번호 확인</label>
      <input
        type="text"
        id="code"
        value={inputState.code}
        onChange={(e) => {
          handleChange(e);
        }}
        className=""
        placeholder="이메일 인증번호"
        required=""
      ></input>
      <button onClick={compareEmailCodeClick}>인증번호 확인하기</button>
    </div>
  );

  const setShowCalendar = () => {
    <div>보이기</div>;
  };

  return (
    <div className="container mx-auto max-w-xl cols-6">
      <form onSubmit={handleSubmit}>
        {/* 아이디 */}
        <div className="mb-6">
          <label className="">아이디</label>
          <input
            type="text"
            id="id"
            value={inputState.id}
            onChange={(e) => {
              handleChange(e);
              idHandleChange(e);
            }}
            className=""
            placeholder="4~8자리"
            required=""
          ></input>

          {/* 아이디 유효성 결과 */}
          {/* 1. 사용 가능 */}
          {inputState.id != "" && idCheckRes && idCheckRes.code == 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{idCheckRes.msg}</span>
            </div>
          ) : null}
          {/* 2. 사용 불가능 */}
          {inputState.id != "" && idCheckRes && idCheckRes.code != 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{idCheckRes.msg}</span>
            </div>
          ) : null}
        </div>
        {/* 이메일 */}
        <div className="mb-6">
          <label className="">이메일</label>
          <input
            type="email"
            id="email"
            value={inputState.email}
            onChange={handleChange}
            className=""
            placeholder=""
            required=""
            disabled={authFin ? true : false}
          ></input>
          <button onClick={sendEmailCodeClick}>이메일 확인</button>
          <>{showEmailCodeCheck ? <CheckEmailCode /> : null}</>
        </div>
        {/* 닉네임 */}
        <div className="mb-6">
          <label className="">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={inputState.nickname}
            onChange={(e) => {
              handleChange(e);
              nicknameHandleChange(e);
            }}
            className=""
            placeholder=""
            required=""
          ></input>
          {/* 닉네임 유효성 결과 */}
          {/* 1. 사용 가능 */}
          {inputState.nickname != "" &&
          nicknameCheckRes &&
          nicknameCheckRes.code == 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{nicknameCheckRes.msg}</span>
            </div>
          ) : null}
          {/* 2. 사용 불가능 */}
          {inputState.nickname != "" &&
          nicknameCheckRes &&
          nicknameCheckRes.code != 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{nicknameCheckRes.msg}</span>
            </div>
          ) : null}
        </div>
        {/* 비밀번호 */}
        <div className="mb-6">
          <label className="">비밀번호</label>
          <input
            type="password"
            id="password"
            value={inputState.password}
            onChange={(e) => {
              handleChange(e);
              pwHandleChange(e);
            }}
            className=""
            placeholder="8~16자리, 영문자, 숫자, 특수문자"
            required=""
          ></input>
          {/* 비밀번호 유효성 결과 */}
          {/* 1. 사용 가능 */}
          {inputState.password != "" && pwCheckRes && pwCheckRes.code == 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{pwCheckRes.msg}</span>
            </div>
          ) : null}
          {/* 2. 사용 불가능 */}
          {inputState.password != "" && pwCheckRes && pwCheckRes.code != 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{pwCheckRes.msg}</span>
            </div>
          ) : null}
        </div>
        {/* 비밀번호 확인 */}
        <div className="mb-6">
          <label className="">비밀번호 확인</label>
          <input
            type="password"
            id="passwordConfirm"
            value={inputState.passwordConfirm}
            onChange={(e) => {
              handleChange(e);
              pwSameCheck(e);
            }}
            className=""
            placeholder=""
            required=""
          ></input>
          {/* 비밀번호 동일 체크 */}
          {inputState.passwordConfirm == "" || pwSameRes ? null : (
            <div className="" role="alert">
              <span className="font-medium">비밀번호가 동일하지 않습니다.</span>
            </div>
          )}
        </div>
        {/* 기수 */}
        <div className="mb-6">
          <SelectGenerationBox
            options={generationOptions}
            defaultValue="6"
          ></SelectGenerationBox>
          {/* 학번 */}
          <label className="">학번</label>
          <input
            type="text"
            id="student_id"
            value={inputState.student_id}
            onChange={handleChange}
            className=""
            placeholder="싸피에서 제공받은 학번"
            required=""
          ></input>
          {/* 반 */}
          <SelectClassBox
            options={classOptions}
          ></SelectClassBox>
        </div>
        {/* 이름 */}
        <div className="mb-6">
          <label className="">이름</label>
          <input
            type="text"
            id="name"
            value={inputState.name}
            onChange={handleChange}
            className=""
            placeholder="이름은 한글만 가능합니다."
            required=""
          ></input>
          <button>싸피생 확인</button>
        </div>
        {/* 분야 */}
        <div className="mb-6">
          <label className="">분야</label>
          <input
            id="position"
            onChange={handleChange}
            type="radio"
            required=""
          ></input>
        </div>
        {/* 생년월일 */}
        <div className="mb-6">
          <label className="">생년월일</label>
          <button onClick={showCalendarClick}>선택</button>
          <>{setShowCalendar ? <showCalendar /> : null}</>
          {/* <Calendar
            locale={ko}
            dateFormat="yyyy년 MM월 dd일"
            selected={inputState.date}
            onChange={(date) => setInputState(date)}
            maxDate={new Date()}
          /> */}
          {/* <DatePicker
            locale={ko}
            dateFormat="yyyy년 MM월 dd일"
            selected={inputState.date}
            onChange={(date) => setInputState(date)}
            maxDate={new Date()}
          /> */}
        </div>
        {/* 전화번호 */}
        <div className="mb-6">
          <label className="">전화번호</label>
          <input
            type="number"
            id="phone"
            value={inputState.phone}
            onChange={handleChange}
            className=""
            placeholder="'-' 없이 입력해주세요"
            required=""
          ></input>
        </div>
        {/* 링크 */}
        <div className="mb-6">
          <label className="">링크</label>
          <button className="">추가</button>
        </div>
        {/* 자기소개 */}
        <div className="mb-6">
          <label className="">자기소개</label>
          <input
            type="textarea"
            id="description"
            value={inputState.description}
            onChange={handleChange}
            className=""
            placeholder="자기자신에 대해 소개해주세요"
            required=""
          ></input>
        </div>

        {/* 가입 버튼 */}
        <button type="submit" className="">
          가입하기
        </button>
      </form>
    </div>
  );
}
