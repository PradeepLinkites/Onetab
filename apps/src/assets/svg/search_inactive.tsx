import * as React from "react";
import Svg, { Path } from "react-native-svg";
export const SearchInactive = (props) => (
  <Svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      opacity={0.5}
      d="M17.1014 15.5927L21.67 20.1614L20.1614 21.67L15.5927 17.1014C13.95 18.4156 11.8667 19.2018 9.60091 19.2018C4.30121 19.2018 0 14.9006 0 9.60091C0 4.30121 4.30121 0 9.60091 0C14.9006 0 19.2018 4.30121 19.2018 9.60091C19.2018 11.8667 18.4156 13.95 17.1014 15.5927ZM14.9611 14.8012C16.2655 13.4568 17.0683 11.6231 17.0683 9.60091C17.0683 5.47519 13.7266 2.13354 9.60091 2.13354C5.47519 2.13354 2.13354 5.47519 2.13354 9.60091C2.13354 13.7266 5.47519 17.0683 9.60091 17.0683C11.6231 17.0683 13.4568 16.2655 14.8012 14.9611L14.9611 14.8012Z"
      fill="#606363"
    />
  </Svg>
);
