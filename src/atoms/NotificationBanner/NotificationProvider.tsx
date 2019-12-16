import React, { useState } from 'react';

import NotificationContext from './NotificationContext';
import DefaultNotificationView from './DefaultNotificationView';
import { IDuration, IBannerStyle, INotificationBannerProps } from './typeDefinition';

const NotificationProvider: React.FC = ({ children }) => {
  const [notificationSettings, setNotificationSettings] = useState<INotificationBannerProps | any>(
    {},
  );

  function handleSetNotificationSettings(text: string, style?: IBannerStyle, duration?: IDuration) {
    setNotificationSettings({ id: Date.now(), text, style, duration });
  }

  return (
    <NotificationContext.Provider
      value={{ notificationSettings, setNotificationSettings: handleSetNotificationSettings }}>
      <DefaultNotificationView
        id={notificationSettings.id}
        text={notificationSettings.text}
        style={notificationSettings.style}
        duration={notificationSettings.duration}
      />
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
