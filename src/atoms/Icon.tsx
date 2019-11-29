import React from 'react';

interface IProps {
  name: string;
  style?: object;
  size?: 'small' | 'large';
}

const Icon: React.FC<IProps> = ({ name, style, size = 'small' }) =>
  React.createElement('ion-icon', { name, style, size });
export default Icon;
