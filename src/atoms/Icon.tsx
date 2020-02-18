import React from 'react';
import { Icon as MaterialIcon, IconButton } from '@material-ui/core';

interface IProps {
  name: string;
  style?: object;
  size?: 'small' | 'large';
  className?: string;
  onClick?: Function;
}

const Icon: React.FC<IProps> = ({ name, style, size, className, onClick }) => {
  if (onClick) {
    return (
      <IconButton onClick={e => onClick(e)}>
        <MaterialIcon style={style} fontSize={size} className={className}>
          {name}
        </MaterialIcon>
      </IconButton>
    );
  }
  return (
    <MaterialIcon style={style} fontSize={size} className={className}>
      {name}
    </MaterialIcon>
  );
};
export default Icon;

// const Icon: React.FC<IProps> = ({ name, style, size, className, onClick }) =>
//   React.createElement('ion-icon', { name, style, size, class: className, onClick });
// export default Icon;
