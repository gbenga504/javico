import React from 'react';
import { Tooltip } from '@material-ui/core';

import './index.css';
import Icon from '../../atoms/Icon';

const iconList = [
  { text: 'Search file', icon: 'ios-search' },
  { text: 'Make full screen', icon: 'ios-expand' },
  { text: 'Share code', icon: 'ios-share-alt' },
  { text: 'Sign in', icon: 'logo-github' },
  { text: 'Light theme', icon: 'ios-bulb' },
];

{
  /* <ion-icon name="contract"></ion-icon> */
}

const MenuBar: React.FC = () => {
  return (
    <section className="menubar flex-column">
      <Tooltip title={'placement.js'} placement="bottom" enterDelay={100}>
        <div className="menubar__title flex-column center mt-16 mb-8">
          <div className="menubar__title-text flex-column center">
            <p>P</p>
          </div>
        </div>
      </Tooltip>
      {iconList.map(el => (
        <Tooltip title={el.text} placement="bottom" enterDelay={100}>
          <div key={el.icon} className="menubar__icon mt-16">
            <Icon name={el.icon} />
          </div>
        </Tooltip>
      ))}
    </section>
  );
};

export default React.memo(MenuBar);
