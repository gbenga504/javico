import React from 'react';

import NotificationContext from './NotificationContext';

const withNotificationBanner = (Component: React.FC<any>) => (props: any) => (
  <NotificationContext.Consumer>
    {({ onSetNotificationSettings }) => (
      <Component {...props} onSetNotificationSettings={onSetNotificationSettings} />
    )}
  </NotificationContext.Consumer>
);

export default withNotificationBanner;
