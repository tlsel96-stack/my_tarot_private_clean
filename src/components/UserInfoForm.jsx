import React, { useState } from "react";

const UserInfoForm = ({ onSubmit }) => {
  const [info, setInfo] = useState({
    name: "",
    birth: "",
    time: "",
    calendar: "양력",
    gender: "여자",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  return (
    <div>
      <h2>🔹 기본 정보 입력</h2>
      <input name="name" placeholder="이름" onChange={handleChange} />
      <input name="birth" placeholder="생년월일 (예: 1995.03.15)" onChange={handleChange} />
      <input name="time" placeholder="태어난 시간 (모르면 모름)" onChange={handleChange} />
      <select name="calendar" onChange={handleChange}>
        <option>양력</option>
        <option>음력</option>
      </select>
      <select name="gender" onChange={handleChange}>
        <option>여자</option>
        <option>남자</option>
      </select>
      <br /><br />
      <button onClick={() => onSubmit(info)}>다음</button>
    </div>
  );
};

export default UserInfoForm;
