import React from "react";

interface ColorRectProps {
  color: string;
  invert?: boolean;
}

const ColorRect = ({ color, invert }: ColorRectProps): JSX.Element => {
  return (
    <div
      style={{
        width: "120px",
        height: "120px",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Karrik",
        borderRadius: 10,
        color: invert ? "#2a2a2a" : "white",
      }}
    >
      {color}
    </div>
  );
};

export default ColorRect;
