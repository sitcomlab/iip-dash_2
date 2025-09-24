import React from "react";

function DynamicDataBox({
  value,
  header,
  unit,
  decimals = 1,
  size = "normal",
  range = null,
  color = "bg-sky-500",
  info = null,
}) {
  let valueRound = value;
  if (typeof value == "number") {
    valueRound = Math.round(value * 10 ** decimals) / 10 ** decimals;
  }

  let boxSize = "w-[7rem] h-[7rem]";
  switch (size) {
    case "normal":
      boxSize = "w-[7rem] h-[7rem]";
      break;
    case "big":
      boxSize = "w-[9.5rem] h-[9.5rem]";
  }

  //TODO: define gradient on value

  const classes = `
    ${boxSize}
    ${color}

    mt-0 pt-0 m-0.5 p-0.5
    rounded-2xl
    shadow-lg

    text-white text-base text-center
    flex flex-col items-center justify-center
    `;
  return (
    <div className={classes}>
      <div className="text-base font-semibold">{header} &nbsp;{info}</div>
      <div className="text-lg font-semibold">{valueRound}</div>
      <div className="text-sm font-semibold">{unit}</div>
    </div>
  );
}

export { DynamicDataBox };
