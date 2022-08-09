import React from "react";
import "../css/playButton.css";

function PlayButton({ active, changeButton, index, hoverIndex }) {
  return (
    <div>
      <div className={hoverIndex === index ? `botón ${active}` : `botón`}>
        <div
          className="fondo glass-ui "
          x="0"
          y="0"
          width="200"
          height="200"
        ></div>
        <div className="icono" width="200" height="200">
          <div
            className="parte izquierda"
            x="0"
            y="0"
            width="200"
            height="200"
            fill="#fff"
          ></div>
          <div
            className="parte derecha"
            x="0"
            y="0"
            width="200"
            height="200"
            fill="#fff"
          ></div>
        </div>
        <div className="puntero" onClick={() => changeButton(index)}></div>
      </div>
    </div>
  );
}

export default PlayButton;
