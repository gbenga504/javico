import React from 'react';

import { color as commonColor } from '../Css';

interface IProps {
  variant?: string;
  className?: string;
  style?: object;
  thickness?: 'bold' | 'regular' | 'semi-bold' | 'light';
  color?: 'initial' | 'warning' | 'error';
  href?: string;
  target?: string;
}

const Typography: React.FC<IProps> = ({
  variant = 'span',
  className,
  style,
  thickness = 'regular',
  children,
  color = 'initial',
  ...rest
}) => {
  function getColor(): string {
    switch (color) {
      case 'initial':
        return commonColor.white;
      case 'warning':
        return commonColor.warningLight;
      case 'error':
        return commonColor.errorLight;
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
    { className, style: Object.assign({}, getFontStyle(), style), ...rest },
    children,
  );
};

export default Typography;
