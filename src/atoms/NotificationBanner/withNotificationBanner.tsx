import React from 'react';

import NotificationContext from './NotificationContext';

const withNotificationBanner = (Component: React.FC) => (props: any) => (
  <NotificationContext.Consumer>
    {({ setNotificationSettings }) => (
      <Component {...props} setNotificationSettings={setNotificationSettings} />
    )}
  </NotificationContext.Consumer>
);

export default withNotificationBanner;
