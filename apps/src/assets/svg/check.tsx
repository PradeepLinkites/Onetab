import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
export const Check = (props) => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={17} height={17} rx={3} fill="#3866E6" />
    <Path d="M2 7L7 12L14 5" stroke="white" strokeLinecap="round" />
  </Svg>
);