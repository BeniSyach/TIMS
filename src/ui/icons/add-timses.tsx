import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const AddTimses = ({ color = "currentColor", size = 24, strokeWidth = 1.5, ...props }) => (
  <Svg 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke={color} 
    strokeWidth={strokeWidth} 
    width={size} 
    height={size}
    {...props}
  >
    <Path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" 
    />
  </Svg>
);
