import React, { useState } from "react";

const tarotCards = Array.from({ length: 22 }, (_, i) => `${i + 1}번 카드`);

const CardSelector = ({ onSelect }) => {
  const [selected, setSelected] = useState([]);

  const toggleCard = (card) => {
    if (selected.includes(card)) {
      setSelected(selected.filter((c) => c !== card));
    } else if (selected.length < 3) {
      setSelected([...selected, card]);
    }
  };

  const randomSelect = () => {
    const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
    setSelected(shuffled.slice(0, 3));
  };

  return (
    <div>
      <h2>🎴 카드 선택 (3장)</h2>
      <button onClick={randomSelect}>랜덤 카드 3장 뽑기</button>
      <div style={{ marginTop: "15px" }}>
        {tarotCards.map((card) => (
          <button
            key={card}
            style={{
              margin: "4px",
              background: selected.includes(card) ? "#c77dff" : "#eee",
            }}
            onClick={() => toggleCard(card)}
          >
            {card}
          </button>
        ))}
      </div>
      <br />
      {selected.length === 3 && (
        <button onClick={() => onSelect(selected)}>선택 완료</button>
      )}
    </div>
  );
};

export default CardSelector;
