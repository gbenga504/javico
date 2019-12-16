import React from 'react';

interface INotificationContext {
  notificationSettings: any;
  setNotificationSettings: Function;
}

const NotificationContext = React.createContext({
  notificationSettings: null,
  setNotificationSettings: () => null,
} as INotificationContext);

export default NotificationContext;
