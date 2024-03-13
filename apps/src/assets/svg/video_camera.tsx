import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const VideoCamera = (props) => (
  <Svg
    width={22}
    height={16}
    viewBox="0 0 22 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16 5.2L21.2133 1.55071C21.4395 1.39235 21.7513 1.44737 21.9096 1.6736C21.9684 1.75764 22 1.85774 22 1.96033V14.0397C22 14.3158 21.7761 14.5397 21.5 14.5397C21.3974 14.5397 21.2973 14.5081 21.2133 14.4493L16 10.8V15C16 15.5523 15.5523 16 15 16H1C0.44772 16 0 15.5523 0 15V1C0 0.44772 0.44772 0 1 0H15C15.5523 0 16 0.44772 16 1V5.2ZM16 8.3587L20 11.1587V4.84131L16 7.6413V8.3587ZM2 2V14H14V2H2ZM4 4H6V6H4V4Z"
      fill="#3866E6"
    />
  </Svg>
);