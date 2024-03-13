import * as React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";
export const Trello = (props) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={25} height={25} rx={5} fill="url(#pattern0)" />
    <Defs>
      <Pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_5789_4388" transform="scale(0.00195312)" />
      </Pattern>
      <Image
        id="image0_5789_4388"
        width={512}
        height={512}
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
