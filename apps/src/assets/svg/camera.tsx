import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const Camera = (props) => (
  <Svg
    width={20}
    height={18}
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M7.82843 2L5.82843 4H2V16H18V4H14.1716L12.1716 2H7.82843ZM7 0H13L15 2H19C19.5523 2 20 2.44772 20 3V17C20 17.5523 19.5523 18 19 18H1C0.44772 18 0 17.5523 0 17V3C0 2.44772 0.44772 2 1 2H5L7 0ZM10 15C6.96243 15 4.5 12.5376 4.5 9.5C4.5 6.46243 6.96243 4 10 4C13.0376 4 15.5 6.46243 15.5 9.5C15.5 12.5376 13.0376 15 10 15ZM10 13C11.933 13 13.5 11.433 13.5 9.5C13.5 7.567 11.933 6 10 6C8.067 6 6.5 7.567 6.5 9.5C6.5 11.433 8.067 13 10 13Z"
      fill="#3866E6"
    />
  </Svg>
);