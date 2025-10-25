import React from "react";

const TarotSelector = ({ onSelect }) => {
  return (
    <div>
      <h2>타로 종류를 선택하세요</h2>
      <button onClick={() => onSelect("연애운")}>연애운</button>
      <button onClick={() => onSelect("금전운")}>금전운</button>
      <button onClick={() => onSelect("직업운")}>직업운</button>
    </div>
  );
};

export default TarotSelector;
