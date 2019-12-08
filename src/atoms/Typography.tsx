import React from 'react';

interface IProps {
  variant?: string;
  className?: string;
  style?: object;
  thickness?: 'bold' | 'regular' | 'semi-bold' | 'light';
  color?: 'initial' | 'warning' | 'error';
}

const Typography: React.FC<IProps> = ({
  variant = 'span',
  className,
  style,
  thickness = 'regular',
  children,
  color = 'initial',
}) => {
  function getColor(): string {
    switch (color) {
      case 'initial':
        return '#fff'; //Mapped to --white-color in our color.css file
      case 'warning':
        return 'rgb(247, 168, 41)'; //Mapped to --warning-light-color in our color.css file
      case 'error':
        return 'rgb(214, 118, 116)'; //Mapped to --error-light-color in our color.css file
    }
  }

  function getFontStyle() {
    let _thickness = thickness === 'semi-bold' ? 'semiBold' : thickness;
    return {
      color: getColor(),
      fontFamily: `Eina ${_thickness[0].toUpperCase()}${_thickness.substr(1)}`,
    };
  }

  return React.createElement(
    variant,
    { className, style: Object.assign({}, getFontStyle(), style) },
    children,
  );
};

export default Typography;
