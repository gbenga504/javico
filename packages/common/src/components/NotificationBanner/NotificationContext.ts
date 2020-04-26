import React from "react";

interface INotificationContext {
  notificationSettings: any;
  onSetNotificationSettings: Function;
}

const NotificationContext = React.createContext({
  notificationSettings: null,
  onSetNotificationSettings: () => null
} as INotificationContext);

export default NotificationContext;
