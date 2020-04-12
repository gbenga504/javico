import React, { useState, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { INotificationBannerProps } from "./typeDefinition";
import { usePrevious, useUpdateEffect } from "../../hooks";

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const DefaultNotificationView: React.FC<INotificationBannerProps> = ({
  style,
  text,
  id,
  duration = "short"
}) => {
  const [isBannerHidden, setIsBannerHidden] = useState<boolean>(true);
  const queueRef = React.useRef<INotificationBannerProps[]>([]);
  const [messageInfo, setMessageInfo] = React.useState<
    INotificationBannerProps | undefined
  >(undefined);
  const previousId = usePrevious(id);

  useUpdateEffect(() => {
    if (id !== previousId) {
      queueRef.current.push({
        style,
        text,
        id,
        duration
      });
    }

    if (isBannerHidden === false) {
      setIsBannerHidden(true);
    } else {
      processQueue();
    }
  }, [id]);

  function processQueue() {
    if (queueRef.current.length > 0) {
      setMessageInfo(queueRef.current.shift());
      setIsBannerHidden(false);
    }
  }

  function handleCloseBanner(event?: React.SyntheticEvent, reason?: string) {
    if (reason === "clickaway") {
      return;
    }
    setIsBannerHidden(true);
  }

  function handleExited() {
    processQueue();
  }

  let snackbarDuration = messageInfo
    ? messageInfo.duration === "short"
      ? 1000
      : 5000
    : 1000;
  return (
    <Snackbar
      key={messageInfo ? messageInfo.id : undefined}
      onExited={handleExited}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isBannerHidden === false}
      autoHideDuration={snackbarDuration}
      onClose={handleCloseBanner}
    >
      {messageInfo && !!messageInfo.text === true ? (
        <Alert
          onClose={handleCloseBanner}
          severity={
            messageInfo.style === "danger" ? "error" : messageInfo.style
          }
        >
          {messageInfo.text}
          {messageInfo.style === "success" && "!"}
        </Alert>
      ) : (
        undefined
      )}
    </Snackbar>
  );
};

export default React.memo(DefaultNotificationView);
