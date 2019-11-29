import React from 'react';

interface IProps {
  variant?: string;
  className?: string;
  style?: object;
  thickness?: 'bold' | 'regular' | 'semi-bold' | 'light';
  color?: string;
}

const Typography: React.FC<IProps> = ({
  variant = 'span',
  className,
  style,
  thickness = 'regular',
  children,
  color = '#fff',
}) => {
  function getFontStyle() {
    let _thickness = thickness === 'semi-bold' ? 'semiBold' : thickness;
    return { color, fontFamily: `Eina ${_thickness[0].toUpperCase()}${_thickness.substr(1)}` };
  }

  return React.createElement(
    variant,
    { className, style: Object.assign({}, getFontStyle(), style) },
    children,
  );
};

export default Typography;
