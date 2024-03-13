import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const Gallery = (props) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M2 8.1005L4 6.1005L9.5 11.6005L13 8.1005L16 11.1005V2H2V8.1005ZM2 10.9289V16H5.1005L8.0858 13.0147L4 8.9289L2 10.9289ZM7.9289 16H16V13.9289L13 10.9289L7.9289 16ZM1 0H17C17.5523 0 18 0.44772 18 1V17C18 17.5523 17.5523 18 17 18H1C0.44772 18 0 17.5523 0 17V1C0 0.44772 0.44772 0 1 0ZM12.5 7C11.6716 7 11 6.32843 11 5.5C11 4.67157 11.6716 4 12.5 4C13.3284 4 14 4.67157 14 5.5C14 6.32843 13.3284 7 12.5 7Z"
      fill="#3866E6"
    />
  </Svg>
);