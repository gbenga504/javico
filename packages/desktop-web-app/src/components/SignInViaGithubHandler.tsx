import React, { useState } from "react";
import {
  IBannerStyle,
  IDuration,
  withNotificationBanner
} from "@javico/common/lib/components/NotificationBanner";
import SignInViaGithubModal from "@javico/common/lib/components/SignInViaGithubModal";
import { Apis } from "@javico/common/lib/utils/Apis";

interface IProps {
  visible: boolean;
  onRequestClose: () => null;
  onSignInSuccess: (user: any) => null;
  onSetNotificationSettings: (
    text: string,
    style?: IBannerStyle,
    duration?: IDuration
  ) => null;
}

const SignInViaGithubHandler: React.FC<IProps> = ({
  visible,
  onRequestClose,
  onSetNotificationSettings,
  onSignInSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);

  function handleSignInWithGithub() {
    setIsLoading(true);
    Apis.users
      .signInWithGithub()
      .then(function(result: any) {
        onRequestClose();
        setIsLoading(false);
        onSignInSuccess(result.user);
      })
      .catch(function(error: any) {
        setIsLoading(false);
        onSetNotificationSettings(error.message, "danger", "long");
      });
  }

  return (
    <SignInViaGithubModal
      visible={visible}
      onRequestClose={onRequestClose}
      onOk={handleSignInWithGithub}
      loading={isLoading}
    />
  );
};

export default React.memo(withNotificationBanner(SignInViaGithubHandler));
