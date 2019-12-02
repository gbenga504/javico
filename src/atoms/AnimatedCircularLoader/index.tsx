import React from 'react';

import './index.css';

interface IProps {
  size?: number;
  color?: string;
}

const AnimatedCircularLoader: React.FC<IProps> = ({ size = 64, color = '#fff' }) => (
  <div className="animated-circular-loader" style={{ width: size, height: size }}>
    {Array.apply(null, Array(4)).map((value, i) => (
      <div
        key={i}
        style={{
          width: size,
          height: size,
          border: `${size / 8}px solid ${color}`,
          margin: size / 8,
          borderColor: `${color} transparent transparent transparent`,
        }}></div>
    ))}
  </div>
);
export default AnimatedCircularLoader;
