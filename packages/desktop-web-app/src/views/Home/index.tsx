import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Tooltip, makeStyles, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  InsertComment as InsertCommentIcon,
  Code as CodeIcon
} from "@material-ui/icons";
import {
  IndeterminateLinearProgress,
  withNotificationBanner,
  Seo
} from "@javico/common/lib/components";
import {
  color,
  useStyles as commonUseStyles,
  padding
} from "@javico/common/lib/design-language/Css";
import {
  IBannerStyle,
  IDuration
} from "@javico/common/lib/components/NotificationBanner";
import {
  Apis,
  getBaseUrl,
  getSourceCodeIdFromUrl
} from "@javico/common/lib/utils";

import Editor from "../../components/Editor";
import MenuBar from "../../components/MenuBar";
import Console from "../../components/Console";
import { getCurrentUserState } from "../../redux/auth/reducers";
import { SET_CURRENT_USER } from "../../redux/auth/actionTypes";
import { RIGHT_SECTION, ISourceCodeMetaData } from "../../utils/Constants";

const CommentListHandler = lazy(() =>
  import("../../components/CommentListHandler")
);

interface IProps {
  onSetNotificationSettings: (
    text: string,
    style?: IBannerStyle,
    duration?: IDuration
  ) => null;
}

const Home: React.FC<IProps> = ({ onSetNotificationSettings }) => {
  const firebaseRef = useRef<any>(null);
  const currentUser = useSelector(getCurrentUserState);
  const dispatch = useDispatch();
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const [terminalExecutableCode, setTerminalExecutableCode] = useState<{
    sourceCode: string;
    sourceCodeHash: null | number;
  }>({ sourceCode: "", sourceCodeHash: null });
  const [currentRightSection, setCurrentRightSection] = useState<string>(
    RIGHT_SECTION.console
  );
  const [
    isFetchingSourceCodeMetaData,
    setIsFetchingSourceCodeMetaData
  ] = useState<boolean>(false);
  const [
    sourceCodeMetaData,
    setSourceCodeMetaData
  ] = useState<null | ISourceCodeMetaData>(null);

  useEffect(() => {
    fetchSourceCodeMetaData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    firebaseRef.current = Apis.users.onAuthStateChanged(function(user: any) {
      if (user && currentUser === null) {
        Apis.users.fetchUserFromDB({ params: { ID: user.uid } }).then(user => {
          dispatch({ type: SET_CURRENT_USER, payload: user });
        });
      }
    });

    return () => {
      firebaseRef.current();
    };
  }, [currentUser, dispatch]);

  function fetchSourceCodeMetaData(): void {
    if (getSourceCodeIdFromUrl()) {
      setIsFetchingSourceCodeMetaData(true);
      Apis.sourceCodes
        .fetchSourceCode({
          params: { ID: getSourceCodeIdFromUrl() }
        })
        .then(res => {
          const { sourceCode, readme, ownerId, title } = res.data();
          setIsFetchingSourceCodeMetaData(false);
          setSourceCodeMetaData({
            sourceCode,
            readme,
            ownerId,
            title,
            sourceCodeId: res.id
          });
        })
        .catch((error: any) => {
          setIsFetchingSourceCodeMetaData(false);
          onSetNotificationSettings(error.message, "danger", "long");
        });
    }
  }

  function updateSourceCodeMetaData(data: {
    sourceCode: string;
    ownerId: string;
    sourceCodeId: string;
  }) {
    setSourceCodeMetaData((prevState: ISourceCodeMetaData | null) => ({
      ...prevState,
      ...data
    }));
  }

  function toggleFetchingSourceCodeMetaDataState(isFetching = true) {
    setIsFetchingSourceCodeMetaData(prevState =>
      isFetching === undefined ? !prevState : isFetching
    );
  }

  function handleToggleRightView() {
    setCurrentRightSection((prevState: string) =>
      prevState === RIGHT_SECTION.console
        ? RIGHT_SECTION.comments
        : RIGHT_SECTION.console
    );
  }

  function renderSwitchView() {
    const IconComponent =
      currentRightSection === RIGHT_SECTION.console
        ? InsertCommentIcon
        : CodeIcon;
    return (
      <Tooltip
        title={
          currentRightSection === RIGHT_SECTION.console ? "chat" : "terminal"
        }
        placement="left"
        enterDelay={100}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleToggleRightView}
          classes={{
            root: classes.switchButtonRoot,
            label: classes.switchButtonLabel
          }}
        >
          <IconComponent
            style={{ color: "#fff", zIndex: 5, fontSize: 16, margin: 5 }}
          />
        </Button>
      </Tooltip>
    );
  }

  let title = "";
  let description = "";
  let photoURL = "";

  if (sourceCodeMetaData) {
    title = sourceCodeMetaData.title || "Untitled.js";
    title = `${title} by ${
      currentUser && currentUser.displayName
        ? currentUser.displayName
        : "Anonymous"
    }`;

    description = sourceCodeMetaData.readme
      ? `${sourceCodeMetaData.readme.substring(0, 60)}...`
      : "Review my source code";
    photoURL = !!currentUser
      ? currentUser.photoURL
      : `${getBaseUrl()}/favicon.png`;
  }

  return (
    <>
      <Seo
        title={title}
        description={description}
        ogImage={photoURL}
        ogUrl={getBaseUrl()}
      />
      <div className={`${classes.relative} ${commonCss.flexRow}`}>
        <div className={classes.linearProgress}>
          <IndeterminateLinearProgress
            isVisible={isFetchingSourceCodeMetaData}
          />
        </div>
        <MenuBar />
        <main className={`${classes.main} ${commonCss.flexRow}`}>
          <Editor
            toggleProgressBarVisibility={toggleFetchingSourceCodeMetaDataState}
            onRunSourceCode={setTerminalExecutableCode}
            changeCurrentRightSection={handleToggleRightView}
            sourceCodeMetaData={sourceCodeMetaData}
            updateSourceCodeMetaData={updateSourceCodeMetaData}
            currentRightSection={currentRightSection}
            isFetchingSourceCodeMetaData={isFetchingSourceCodeMetaData}
            fetchSourceCodeMetaData={fetchSourceCodeMetaData}
          />
          <div className={classes.mainRightSection}>
            <div
              className={`${classes.rightSubSection} ${
                currentRightSection === "console"
                  ? classes.showRightSubSection
                  : classes.hideRightSubSection
              }`}
            >
              <Console
                ownerId={sourceCodeMetaData ? sourceCodeMetaData.ownerId : null}
                sourceCode={terminalExecutableCode.sourceCode}
                sourceCodeHash={terminalExecutableCode.sourceCodeHash}
                fetchedReadme={
                  sourceCodeMetaData ? sourceCodeMetaData.readme : null
                }
              />
            </div>
            <div
              className={`${classes.rightSubSection} ${
                currentRightSection === "comments"
                  ? classes.showRightSubSection
                  : classes.hideRightSubSection
              }`}
            >
              <Suspense fallback={null}>
                <CommentListHandler
                  visible={currentRightSection === RIGHT_SECTION.comments}
                  sourceCodeId={
                    sourceCodeMetaData ? sourceCodeMetaData.sourceCodeId : null
                  }
                />
              </Suspense>
            </div>
            {renderSwitchView()}
          </div>
        </main>
      </div>
    </>
  );
};

const useStyles = makeStyles({
  main: {
    width: "100%"
  },
  relative: {
    position: "relative"
  },
  mainRightSection: {
    flex: 1,
    height: "100%",
    borderLeft: `1px solid ${color.darkThemeLightBorder}`,
    minWidth: "30%",
    overflow: "hidden",
    backgroundColor: color.darkThemeBlack,
    position: "relative"
  },
  linearProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5
  },
  switchButtonRoot: {
    position: "absolute",
    zIndex: 1000,
    right: 10,
    top: 10,
    minWidth: 50,
    width: 50,
    animationName: `$expandSwitchButton`,
    animationDuration: "2000ms",
    animationIterationCount: "infinite",
    ...padding(5, "lr"),
    ...padding(0, "tb")
  },
  switchButtonLabel: {
    display: "flex",
    flexDirection: "column",
    "& ion-icon": {
      fontSize: 25
    }
  },
  rightSubSection: {
    position: "absolute",
    width: "100%",
    transition: "all 0.6s",
    height: "100vh"
  },
  showRightSubSection: {
    right: "0%",
    opacity: 1
  },
  hideRightSubSection: {
    right: "-100%",
    opacity: 0
  },
  "@keyframes expandSwitchButton": {
    "0%": {
      transform: "scale(1)"
    },
    "50%": {
      transform: "scale(1.1)"
    },
    "100%": {
      transform: "scale(1)"
    }
  }
});

export default React.memo(withNotificationBanner(Home));
