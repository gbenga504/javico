import React, { useState, useEffect, lazy, Suspense } from "react";
import { Tooltip, makeStyles, Button } from "@material-ui/core";
import {
  InsertComment as InsertCommentIcon,
  Code as CodeIcon
} from "@material-ui/icons";
import {
  MonacoEditor,
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
import { Apis } from "@javico/common/lib/utils/Apis";
import {
  getSourceCodeIdFromUrl,
  getBaseUrl
} from "@javico/common/lib/utils/UrlUtils";

import MenuBar from "../../components/MenuBar";
import Console from "../../components/Console";
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

interface ISourceCodeMetaData {
  sourceCode: string;
  readme?: string;
  ownerId: string;
  title?: string;
  sourceCodeId: string;
}

const RIGHT_SECTION = {
  comments: "comments",
  console: "console"
};

const Home: React.FC<IProps> = ({ onSetNotificationSettings }) => {
  const [terminalExecutableCode, setTerminalExecutableCode] = useState<{
    sourceCode: string;
    sourceCodeHash: null | number;
  }>({ sourceCode: "", sourceCodeHash: null });
  const [currentRightSection, setCurrentRightSection] = useState<string>(
    RIGHT_SECTION.console
  );
  const [user, setUser] = useState<any>(null);
  const [
    isFetchingSourceCodeMetaData,
    setIsFetchingSourceCodeMetaData
  ] = useState<boolean>(false);
  const [
    sourceCodeMetaData,
    setSourceCodeMetaData
  ] = useState<null | ISourceCodeMetaData>(null);
  const classes = useStyles();
  const commonCss = commonUseStyles();

  useEffect(() => {
    Apis.users.onAuthStateChanged(function(user: any) {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    fetchSourceCodeMetaData();
  }, []);

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

  function handleToggleView() {
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
          onClick={handleToggleView}
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

  return (
    <>
      <Seo
        title={`${
          sourceCodeMetaData ? sourceCodeMetaData.title : "Untitled"
        }.js by ${
          !!user && !!user.displayName ? user.displayName : "Anonymous"
        }`}
        description={
          !!fetchedSourceCode.readme === true
            ? `${fetchedSourceCode.readme.substring(0, 60)}...`
            : "Review my source code"
        }
        ogImage={!!user ? user.photoURL : `${getBaseUrl()}/favicon.png`}
        ogUrl={getBaseUrl()}
      />
      <div className={`${classes.relative} ${commonCss.flexRow}`}>
        <div className={classes.linearProgress}>
          <IndeterminateLinearProgress isVisible={isLoading} />
        </div>
        <MenuBar />
        <main className={`${classes.main} ${commonCss.flexRow}`}>
          <MonacoEditor
            onHandleLoading={toggleIsLoading}
            onRunSourceCode={setTerminalExecutableCode}
            onChangeCurrentSection={handleToggleView}
            fetchedSourceCode={fetchedSourceCode}
            onSetSourcecodeOwner={setSourcecodeOwner}
            user={user}
            currentSection={currentSection}
            isFetchingSourcecode={isLoading}
            fetchSourceCode={fetchSourceCode}
          />
          <div className={classes.mainRightSection}>
            <div
              className={`${classes.rightSubSection} ${
                currentSection === "console"
                  ? classes.showRightSubSection
                  : classes.hideRightSubSection
              }`}
            >
              <Console
                ownerId={fetchedSourceCode.ownerId}
                sourceCode={terminalExecutableCode.sourceCode}
                sourceCodeHash={terminalExecutableCode.sourceCodeHash}
                fetchedReadme={fetchedSourceCode.readme}
                user={user}
              />
            </div>
            <div
              className={`${classes.rightSubSection} ${
                currentSection === "comments"
                  ? classes.showRightSubSection
                  : classes.hideRightSubSection
              }`}
            >
              <Suspense fallback={null}>
                <CommentListHandler
                  visible={currentSection === "comments"}
                  sourceCodeId={fetchedSourceCode.sourceCodeId}
                  user={user}
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
    minWidth: "50%",
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
    transition: "all 0.6s"
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
