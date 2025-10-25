import React from "react";

const categories = [
  "연애",
  "재회",
  "결혼",
  "이혼",
  "이직",
  "재물",
  "이사",
  "대인관계",
];

const CategorySelector = ({ onSelect }) => (
  <div>
    <h2>🔹 리딩 카테고리 선택</h2>
    {categories.map((cat) => (
      <button key={cat} onClick={() => onSelect(cat)} style={{ margin: "6px" }}>
        {cat}
      </button>
    ))}
  </div>
);

export default CategorySelector;
