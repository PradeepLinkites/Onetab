import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const Message = (props) => (
  <Svg
    width={15}
    height={14}
    viewBox="0 0 15 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M3.19814 11.4872L0 14V0.717949C0 0.32144 0.32144 0 0.717949 0H13.641C14.0375 0 14.359 0.32144 14.359 0.717949V10.7692C14.359 11.1658 14.0375 11.4872 13.641 11.4872H3.19814ZM2.70151 10.0513H12.9231V1.4359H1.4359V11.0457L2.70151 10.0513ZM4.30769 5.02564H10.0513V6.46154H4.30769V5.02564Z"
      fill="#656971"
    />
  </Svg>
);