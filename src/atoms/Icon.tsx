import React from 'react';

interface IProps {
  name: string;
  style?: object;
  size?: 'small' | 'large';
  className?: string;
}

const Icon: React.FC<IProps> = ({ name, style, size, className }) =>
  React.createElement('ion-icon', { name, style, size, class: className });
export default Icon;
