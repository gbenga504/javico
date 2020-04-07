import React from "react";
import {
  NotificationProvider,
  withNotificationBanner,
  IBannerStyle,
  IDuration
} from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { withKnobs, select } from "@storybook/addon-knobs";

import { theme } from "../../design-language/Css";

interface IProps {
  onSetNotificationSettings: (
    text: string,
    style?: IBannerStyle,
    duration?: IDuration
  ) => null; //passed by withNotificationBanner HOC
  notificationText: string;
  notificationStyle: IBannerStyle;
  notificationDuration: IDuration;
  children: React.ReactElement;
}

export default {
  title: "NotificationBanner",
  decorators: [
    storyFn => (
      <MuiThemeProvider theme={theme}>
        <NotificationProvider>{storyFn()}</NotificationProvider>
      </MuiThemeProvider>
    ),
    withKnobs
  ]
};

const TriggerNotification: React.FC<IProps> = ({
  onSetNotificationSettings,
  notificationText,
  notificationStyle,
  notificationDuration,
  children
}) => {
  function handleShowNotification() {
    onSetNotificationSettings(
      notificationText,
      notificationStyle,
      notificationDuration
    );
  }

  return (
    <>
      <button onClick={handleShowNotification}>Show Notification</button>
      {children}
    </>
  );
};

const TriggerNotificationWrapper = withNotificationBanner(
  React.memo(TriggerNotification)
);

const options = ["long", "short"];
const defaultOption = "short";
export const error = () => (
  <TriggerNotificationWrapper
    notificationText="Something bad Occurred"
    notificationStyle="danger"
    notificationDuration={select("duration", options, defaultOption)}
  >
    This is an error page
  </TriggerNotificationWrapper>
);
export const success = () => (
  <TriggerNotificationWrapper
    notificationText="Response was successful"
    notificationStyle="success"
    notificationDuration={select("duration", options, defaultOption)}
  >
    This is a success page
  </TriggerNotificationWrapper>
);
export const warning = () => (
  <TriggerNotificationWrapper
    notificationText="Date value is outdated defaulting!!!"
    notificationStyle="warning"
    notificationDuration={select("duration", options, defaultOption)}
  >
    This is a warning page
  </TriggerNotificationWrapper>
);
export const info = () => (
  <TriggerNotificationWrapper
    notificationText="Javico has been upgraded"
    notificationStyle="info"
    notificationDuration={select("duration", options, defaultOption)}
  >
    This is a info page
  </TriggerNotificationWrapper>
);
