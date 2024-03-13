import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const NewMessage = (props) => (
  <Svg
    width={22}
    height={23}
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12 3V5H2V18.3851L3.76282 17H18V10H20V18C20 18.5523 19.5523 19 19 19H4.45455L0 22.5V4C0 3.44772 0.44772 3 1 3H12ZM17 3V0H19V3H22V5H19V8H17V5H14V3H17Z"
      fill="white"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 10H5V8H12V10Z"
      fill="white"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 14H5V12H12V14Z"
      fill="white"
    />
  </Svg>
);
