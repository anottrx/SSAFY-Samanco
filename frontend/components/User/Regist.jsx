import React, {useState} from 'react'
import { registAPI, idCheckAPI } from "../../pages/api/user"

export default function Regist() {
    // id, password 유효성 검사 반환 결과 : idCheckRes, pwCheckRes
    const [idCheckRes, setIdCheckRes] = useState(null);
    const [pwCheckRes, setPwCheckRes] = useState(null);
    const [pwSameRes, setPwSameRes] = useState(null);

    const [inputState, setInputState] = useState({
        id: "",
        name: "",
        password: "",
        passwordConfirm: "",
        email: "",
        phone: "",
        });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setInputState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const idHandleChange = (e) => {
        const value = e.target.value;
        idCheckAPI(value).then(res => {
            setIdCheckRes({code:res.statusCode, msg: res.message})
        })
    };

    const pwHandleChange = (e) => {
        const value = e.target.value;   // 입력한 값
        setPwCheckRes(pwReg.test(value)?
            {code:200, msg:"사용 가능한 비밀번호입니다."}
            :
            {code:401, msg:"비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요."}
        )
    };

    const pwSameCheck = (e) => {
        const value = e.target.value;
        setPwSameRes(inputState.password == value? true : false)
    }

    const idReg = /^[A-Za-z0-9_-]{4,8}$/;
    // 아이디 정규표현식 : 최소 4자, 최대 8자

    const pwReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{8,16}$/;
    // 비밀번호 정규표현식 : 최소 8자, 최대 16자, 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자

    const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    // 이메일 정규표현식

    const phoneReg = /^[0-9]{8,13}$/;
    // 전화번호 정규표현식

    const handleSubmit = (event) => {
        event.preventDefault();

        let isNormal = true;
        let msg = "";

        if (!inputState.id) {
            isNormal = false;
            msg = "아이디를 입력해주세요."
        } else if (!idReg.test(inputState.id)) {
            isNormal = false;
            msg = "아이디의 양식을 확인해주세요."
        } else if (!inputState.password) {
            isNormal = false;
            msg = "비밀번호를 입력해주세요."
        } else if (!pwReg.test(inputState.password)) {
            isNormal = false;
            msg = "비밀번호 양식을 확인해주세요."
        } else if (inputState.password != inputState.passwordConfirm) {
            isNormal = false;
            msg = "비밀번호가 동일하지 않습니다."
        } else if (!inputState.name) {
            isNormal = false;
            msg = "이름을 입력해주세요."
        } else if (!inputState.email) {
            isNormal = false;
            msg = "이메일을 입력해주세요."
        } else if (!emailReg.test(inputState.email)) {
            isNormal = false;
            msg = "이메일 양식을 확인해주세요."
        } else if (!inputState.phone) {
            isNormal = false;
            msg = "전화번호를 입력해주세요."
        } else if (!phoneReg.test(inputState.phone)) {
            isNormal = false;
            msg = "전화번호 양식을 확인해주세요."
        } else {
            isNormal = true;
        }

        if (isNormal) {
            registAPI(inputState)
            .then(res => {
                if (res.statusCode == 200) {
                    // 가입 성공 시
                    alert("가입이 되었습니다!");
                    // 페이지 이동
                    navigate("/login",
                    { replace: true })
                }
                else
                    alert(`${res.message}`); })
        } else {
            alert(msg)
        }
    };


    return (
        <div className="container mx-auto max-w-xl cols-6">
            <form onSubmit={handleSubmit}>
                {/* 아이디 */}
                <div className="mb-6">
                    <label
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">아이디</label>
                    <input
                        type="text" id="id" value={inputState.id} onChange={(e) => {handleChange(e); idHandleChange(e);}}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="4~8자리" required=""></input>

                    {/* 아이디 유효성 결과 */}
                    {/* 1. 사용 가능 */}
                    {inputState.id != "" && idCheckRes && idCheckRes.code == 200 ?
                    <div className="p-4 mb-4 text-sm text-gray-700 bg-green-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                        <span className="font-medium">{idCheckRes.msg}</span>
                    </div>
                    :null}
                    {/* 2. 사용 불가능 */}
                    {inputState.id != "" && idCheckRes && idCheckRes.code != 200 ?
                    <div className="p-4 mb-4 text-sm text-gray-700 bg-red-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                        <span className="font-medium">{idCheckRes.msg}</span>
                    </div>
                    :null}
                </div>

                {/* 비밀번호 */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">비밀번호</label>
                    <input type="password" id="password" value={inputState.password} onChange={(e) => {handleChange(e); pwHandleChange(e);}}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="8~16자리, 영문자, 숫자, 특수문자" required=""></input>

                    {/* 비밀번호 유효성 결과 */}
                    {/* 1. 사용 가능 */}
                    {inputState.password != "" && pwCheckRes && pwCheckRes.code == 200 ?
                    <div className="p-4 mb-4 text-sm text-gray-700 bg-green-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                        <span className="font-medium">{pwCheckRes.msg}</span>
                    </div>
                    :null}
                    {/* 2. 사용 불가능 */}
                    {inputState.password != "" && pwCheckRes && pwCheckRes.code != 200 ?
                    <div className="p-4 mb-4 text-sm text-gray-700 bg-red-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                        <span className="font-medium">{pwCheckRes.msg}</span>
                    </div>
                    :null}
                </div>
                {/* 비밀번호 확인 */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">비밀번호 확인</label>
                    <input type="password" id="passwordConfirm" value={inputState.passwordConfirm} onChange={(e) => {handleChange(e); pwSameCheck(e);}}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="" required=""></input>
                    {/* 비밀번호 동일 체크 */}
                    { inputState.passwordConfirm == "" || pwSameRes ? null:
                        <div className="p-4 mb-4 text-sm text-gray-700 bg-red-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                            <span className="font-medium">비밀번호가 동일하지 않습니다.</span>
                        </div>
                    }
                </div>
                {/* 이름 */}
                <div className="mb-6">
                    <label
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">이름</label>
                    <input
                        type="text" id="name" value={inputState.name} onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="이름은 한글만 가능합니다." required=""></input>
                </div>
                {/* 이메일 */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">이메일</label>
                    <input type="email" id="email" value={inputState.email} onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="" required=""></input>
                </div>
                {/* 전화번호 */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">전화번호</label>
                    <input type="number" id="phone" value={inputState.phone} onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="'-' 없이 입력해주세요" required=""></input>
                </div>

                {/* 가입 버튼 */}
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">가입하기</button>
            </form>
        </div>
    )
}