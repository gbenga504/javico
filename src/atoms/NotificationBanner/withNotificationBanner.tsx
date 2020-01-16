import React, { useContext } from 'react';

import NotificationContext from './NotificationContext';

const withNotificationBanner = (Component: React.FC<any>) => (props: any) => {
  const { onSetNotificationSettings } = useContext(NotificationContext);

  return <Component {...props} onSetNotificationSettings={onSetNotificationSettings} />;
};

export default withNotificationBanner;
