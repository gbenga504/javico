import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab } from "@material-ui/core";
import { NotInterested as ClearIcon } from "@material-ui/icons";
import {
  withNotificationBanner,
  Terminal
} from "@javico/common/lib/components";
import { Apis } from "@javico/common/lib/utils/Apis";
import { getSourceCodeIdFromUrl } from "@javico/common/lib/utils/UrlUtils";
import { useSelector } from "react-redux";

import { useStyles } from "./styles";
import Readme from "./Readme";
import Preview from "./Preview";
import SignInViaGithubHandler from "../SignInViaGithubHandler";
import { getCurrentUserState } from "../../redux/auth/reducers";

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

  function renderTerminalBasedActions() {
    return (
      currentTab === 0 && (
        <div className={classes.consoleTerminalBasedActionsContainer}>
          <ClearIcon
            className={classes.consoleTerminalClearIcon}
            onClick={handleClearConsole}
          />
        </div>
      )
    );
  }

  return (
    <section className={classes.console}>
      <div>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="console tabs"
        >
          <Tab label="TERMINAL" {...a11yProps(0)} />
          {isAuthorize && <Tab label="READ ME" {...a11yProps(1)} />}
          <Tab label={isAuthorize ? "PREVIEW" : "READ ME"} {...a11yProps(2)} />
        </Tabs>
        {renderTerminalBasedActions()}
      </div>
      <div className={classes.consoleSection}>
        {currentTab === 0 && <Terminal terminalMessages={terminalMessages} />}
        {currentTab === 1 ? (
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
        {currentTab === 2 && <Preview readMe={readMe} />}
      </div>
      <SignInViaGithubHandler
        visible={isSignInModalVisible}
        onRequestClose={handleCloseSignInModal}
        onSignInSuccess={submitReadme}
      />
    </section>
  );
};

export default React.memo(withNotificationBanner(Console));
