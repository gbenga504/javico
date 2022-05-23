import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  AppBar,
  Button,
  Avatar,
  Tooltip
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Apis } from "@javico/common/lib/utils";
import { GitHub as GitHubIcon } from "@material-ui/icons";
import {
  IBannerStyle,
  IDuration,
  withNotificationBanner
} from "@javico/common/lib/components/NotificationBanner";

import digitalForAllLogo from "../assets/images/jc_logo.png";
import { SET_CURRENT_USER } from "../redux/auth/actionTypes";
import { getCurrentUserState } from "../redux/auth/reducers";

interface IProps {
  onSetNotificationSettings: (
    text: string,
    style?: IBannerStyle,
    duration?: IDuration
  ) => null;
}

const NavBar: React.FC<IProps> = ({ onSetNotificationSettings }) => {
  const [
    isFetchingCurrentUser,
    setFetchingCurrentUser
  ] = useState<Boolean | null>(null);
  const firebaseRef = useRef<any>(null);
  const currentUser = useSelector(getCurrentUserState);
  const dispatch = useDispatch();

  useEffect(() => {
    setFetchingCurrentUser(true);
    firebaseRef.current = Apis.users.onAuthStateChanged(function(user: any) {
      if (user && currentUser === null) {
        Apis.users.fetchUserFromDB({ params: { ID: user.uid } }).then(user => {
          setFetchingCurrentUser(false);
          dispatch({ type: SET_CURRENT_USER, payload: user });
        });
        return;
      }
      setFetchingCurrentUser(false);
    });

    return () => {
      firebaseRef.current();
    };
  }, [currentUser, dispatch]);

  function handleSignInWithGithub() {
    Apis.users
      .signInWithGithub()
      .then(function(user: any) {
        dispatch({
          type: SET_CURRENT_USER,
          payload: user
        });
      })
      .catch(function(error: any) {
        onSetNotificationSettings(error.message, "danger", "long");
      });
  }

  return (
    <AppBar
      position="static"
      style={{
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)", // Fix on Mobile
        background:
          "linear-gradient(rgba(255,255,255,.04), rgba(255,255,255,0.04))",
        boxShadow: "none"
      }}
    >
      <Container maxWidth="md">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={3}
        >
          <Link to="/">
            <img src={digitalForAllLogo} alt="logo" style={{ width: 40 }} />
          </Link>
          <Box display="flex" alignItems="center">
            <Button
              size="large"
              component={Link}
              to="/"
              variant="text"
              color="primary"
              style={{ marginLeft: 16 }}
            >
              Home
            </Button>
            <Button
              size="large"
              component={Link}
              to="/explore"
              variant="text"
              color="primary"
              style={{ marginLeft: 16 }}
            >
              Explore
            </Button>
            <Button
              size="large"
              component={Link}
              to={
                !!currentUser?.photoURL
                  ? `/${currentUser.username}/new`
                  : "/code"
              }
              variant="text"
              color="primary"
              style={{ marginLeft: 16 }}
            >
              Code
            </Button>
            {currentUser === null && isFetchingCurrentUser === false && (
              <Button
                size="large"
                component={Link}
                to="/code"
                variant="contained"
                color="primary"
                style={{ marginLeft: 16 }}
                onClick={handleSignInWithGithub}
                endIcon={<GitHubIcon />}
              >
                Login
              </Button>
            )}
            {!!currentUser?.photoURL && (
              <Tooltip title="View profile" enterDelay={100}>
                <Avatar
                  component={Link}
                  to={`/${currentUser.username}`}
                  style={{ marginLeft: 16, height: 50, width: 50 }}
                  src={currentUser?.photoURL}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
};

export default React.memo(withNotificationBanner(NavBar));
