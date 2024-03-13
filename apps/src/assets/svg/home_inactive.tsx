import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const HomeInactive = (props) => (
  <Svg
    width={25}
    height={23}
    viewBox="0 0 25 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      opacity={0.5}
      d="M20.4545 22.5H4.54545C3.91786 22.5 3.40909 21.9987 3.40909 21.3803V11.3032H0L11.7356 0.791177C12.169 0.402941 12.831 0.402941 13.2644 0.791177L25 11.3032H21.5909V21.3803C21.5909 21.9987 21.0822 22.5 20.4545 22.5ZM5.68182 20.2606H19.3182V9.2402L12.5 3.13287L5.68182 9.2402V20.2606ZM7.95455 15.7819H17.0455V18.0213H7.95455V15.7819Z"
      fill="#606363"
    />
  </Svg>
);
