import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const BackIcon = (props) => (
  <Svg
    width={11}
    height={18}
    viewBox="0 0 11 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M9.5 1.5L2 9L9.5 16.5"
      stroke="#171C26"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
