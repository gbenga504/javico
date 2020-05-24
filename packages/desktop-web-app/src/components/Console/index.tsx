import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab as MuiTab, withStyles } from "@material-ui/core";
import {
  withNotificationBanner,
  Terminal
} from "@javico/common/lib/components";
import { Apis } from "@javico/common/lib/utils/Apis";
import { getSourceCodeIdFromUrl } from "@javico/common/lib/utils/UrlUtils";
import { useSelector } from "react-redux";
import { color } from "@javico/common/lib/design-language/Css";

import { useStyles } from "./styles";
import Readme from "./Readme";
import Preview from "./Preview";
import SignInViaGithubHandler from "../SignInViaGithubHandler";
import { getCurrentUserState } from "../../redux/auth/reducers";
import ResizeListener from "../../atoms/ResizeListener";

function a11yProps(index: number) {
  return {
    id: `console-tab-${index}`,
    "aria-controls": `console-tabpanel-${index}`
  };
}

type Methods =
  | "log"
  | "warn"
  | "error"
  | "info"
  | "debug"
  | "time"
  | "assert"
  | "count"
  | "table";
type TerminalMessageType = { id: string; method: Methods; data: any[] };
type TerminalMessagesType = TerminalMessageType[];

const Tab = withStyles({
  root: {
    color: `${color.white} !important`
  }
})(MuiTab);

const Console: React.FC<{
  sourceCode: string;
  sourceCodeHash: null | number;
  fetchedReadme: string;
  onSetNotificationSettings: any;
  ownerId: string;
}> = ({
  sourceCode,
  sourceCodeHash,
  ownerId,
  fetchedReadme,
  onSetNotificationSettings
}) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [isSavingReadme, setIsSavingReadme] = useState<boolean>(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(
    false
  );
  const [terminalMessages, setTerminalMessages] = useState<
    TerminalMessagesType
  >([]);
  const [readMe, setReadMe] = useState<string>(fetchedReadme);
  const workerRef = useRef<any>(null);
  const classes = useStyles();
  const user = useSelector(getCurrentUserState);
  const isAuthorize = !!user ? user.uid === ownerId : false;

  useEffect(() => {
    workerRef.current = new Worker(
      `${window.location.origin}/CodeEvaluatorWorker.js`
    );
    workerRef.current.addEventListener("message", function(e: {
      data: TerminalMessageType;
    }) {
      setTerminalMessages((prevTerminalMessages: TerminalMessagesType) => [
        ...prevTerminalMessages,
        e.data
      ]);
    });
  }, []);

  useEffect(() => {
    if (!!sourceCodeHash === true) {
      setTerminalMessages([]);
      workerRef.current.postMessage({ sourceCode });
    }
  }, [sourceCodeHash, sourceCode]);

  useEffect(() => {
    setReadMe(fetchedReadme);
  }, [fetchedReadme]);

  function handleTabChange(event: React.ChangeEvent<{}>, currentTab: number) {
    setCurrentTab(currentTab);
  }

  function handleReadMeTextChange(e: any) {
    setReadMe(e.target.value);
  }

  function handleCloseSignInModal() {
    setIsSignInModalVisible(false);
  }

  function handleClearConsole() {
    setTerminalMessages([]);
  }

  function submitReadme() {
    setIsSavingReadme(true);
    let me = Apis.users.getCurrentUser();
    if (!me) {
      setIsSignInModalVisible(true);
      return;
    }
    const id = getSourceCodeIdFromUrl();
    Apis.sourceCodes
      .saveSourceCode({
        data: { readme: readMe },
        params: { ID: id }
      })
      .then((res: any) => {
        setIsSavingReadme(false);
      })
      .catch((error: any) => {
        setIsSavingReadme(false);
        onSetNotificationSettings(error.message, "danger", "long");
      });
  }

  return (
    <section className={classes.console}>
      <div>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="console tabs"
        >
          {isAuthorize && <Tab label="READ ME" {...a11yProps(0)} />}
          <Tab label={isAuthorize ? "PREVIEW" : "READ ME"} {...a11yProps(1)} />
        </Tabs>
      </div>
      <div className={classes.consoleSection}>
        {currentTab === 0 ? (
          isAuthorize ? (
            <Readme
              readMe={readMe}
              onSubmitReadme={submitReadme}
              isLoading={isSavingReadme}
              onHandleReadMeTextChange={handleReadMeTextChange}
            />
          ) : (
            <Preview readMe={readMe} />
          )
        ) : null}
        {currentTab === 1 && <Preview readMe={readMe} />}
      </div>
      <ResizeListener
        resizePos={{
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          width: "100%"
        }}
        resizeDirection="height"
        initialHeight="40%"
        style={{
          minHeight: "5%",
          width: "100%"
        }}
      >
        <div className={classes.terminalSection}>
          <Terminal
            terminalMessages={terminalMessages}
            onClearConsole={handleClearConsole}
          />
        </div>
      </ResizeListener>
      <SignInViaGithubHandler
        visible={isSignInModalVisible}
        onRequestClose={handleCloseSignInModal}
        onSignInSuccess={submitReadme}
      />
    </section>
  );
};

export default React.memo(withNotificationBanner(Console));
