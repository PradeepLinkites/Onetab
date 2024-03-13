import * as React from "react";
import Svg, { Rect } from "react-native-svg";
export const UnCheck = (props) => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={1}
      y={1}
      width={15}
      height={15}
      rx={2}
      stroke="#656971"
      strokeWidth={2}
    />
  </Svg>
);