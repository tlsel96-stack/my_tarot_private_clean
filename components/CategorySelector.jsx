import React from "react";

const CategorySelector = ({ category, onSelect }) => {
  return (
    <div>
      <h3>{category} 관련 질문을 선택하세요</h3>
      <button onClick={() => onSelect("오늘의 운세")}>오늘의 운세</button>
      <button onClick={() => onSelect("한 달 운세")}>한 달 운세</button>
      <button onClick={() => onSelect("올해의 흐름")}>올해의 흐름</button>
    </div>
  );
};

export default CategorySelector;
