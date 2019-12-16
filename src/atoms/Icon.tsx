import React from 'react';

interface IProps {
  name: string;
  style?: object;
  size?: 'small' | 'large';
  className?: string;
  onClick?: Function;
}

const Icon: React.FC<IProps> = ({ name, style, size, className, onClick }) =>
  React.createElement('ion-icon', { name, style, size, class: className, onClick });
export default Icon;
