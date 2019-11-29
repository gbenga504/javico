import React from 'react';

import './index.css';
import Icon from '../../atoms/Icon';

const iconList = [
  { icon: 'search' },
  { icon: 'expand' },
  { icon: 'share' },
  { icon: 'logo-github' },
  { icon: 'color-palette' },
];

const MenuBar: React.FC = () => {
  return (
    <section className="menubar flex-column">
      <div className="menubar__title flex-column mt-16 mb-8">
        <p className="menubar__title--text">P</p>
      </div>
      {iconList.map(el => (
        <div key={el.icon} className="menubar__icon mt-8">
          <Icon name={el.icon} />
        </div>
      ))}
    </section>
  );
};

export default React.memo(MenuBar);
