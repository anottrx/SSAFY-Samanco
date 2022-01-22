import React, { useState } from "react";
import { OutlinedInput, Button } from "@mui/material";
import { checkEmailPWAPI } from "../../pages/api/user";

export default function CheckEmailCode() {
  const [code, setCode] = useState("");
  const [authFin, setAuthFin] = useState(false);

  const codeHandleChange = (e) => {
    const value = e.target.value; // 입력한 값
    setCode(value);
  };

  const compareEmailCodeClick = (e) => {
    // 이메일로 받은 인증번호 입력해서 확인하기 + 확인 완료되면 폼 닫고 이메일 입력 못 받게 바꾸기
    e.preventDefault();
    const value = code;

    if (!value) {
      alert("인증번호를 입력해주세요.");
    } else {
      console.log(value);
      //   checkEmailPWAPI(value).then((res) => {
      //     setEmailCodeRes({ code: res.statusCode, msg: res.message });
      setAuthFin(true);
      //   });
    }
  };

  return (
    <div>
      <label className="">인증번호 확인</label>
      <br />
      <OutlinedInput
        type="text"
        id="code"
        placeholder="이메일 인증번호"
        value={code}
        onChange={codeHandleChange}
        sx={{ width: 240 }}
        disabled={authFin ? true : false}
      />
      <Button onClick={compareEmailCodeClick}>확인</Button>
    </div>
  );
}
