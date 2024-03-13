import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const ShareContact = (props) => (
  <Svg
    width={18}
    height={20}
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17 20H3C1.34315 20 0 18.6569 0 17V3C0 1.34315 1.34315 0 3 0H17C17.5523 0 18 0.44772 18 1V19C18 19.5523 17.5523 20 17 20ZM16 18V16H3C2.44772 16 2 16.4477 2 17C2 17.5523 2.44772 18 3 18H16ZM2 14.1707C2.31278 14.0602 2.64936 14 3 14H16V2H3C2.44772 2 2 2.44772 2 3V14.1707ZM9 8C7.8954 8 7 7.10457 7 6C7 4.89543 7.8954 4 9 4C10.1046 4 11 4.89543 11 6C11 7.10457 10.1046 8 9 8ZM6 12C6 10.3431 7.3431 9 9 9C10.6569 9 12 10.3431 12 12H6Z"
      fill="#3866E6"
    />
  </Svg>
);