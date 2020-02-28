import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { NotInterested as ClearIcon } from '@material-ui/icons';
import { Console as ConsoleFeeds } from 'console-feed';

import { useStyles } from './styles';
import { Typography, withNotificationBanner, ButtonWithLoading } from '../../atoms';
import MarDownRenderer from '../MarkDownRenderer';
import { getSourceCodeIdFromUrl, getSourcecodeUrl, getBaseUrl } from '../../utils/UrlUtils';
import { Apis } from '../../utils/Apis';
import SignInViaGithubModal from '../SignInViaGithubModal';

function a11yProps(index: number) {
  return {
    id: `console-tab-${index}`,
    'aria-controls': `console-tabpanel-${index}`,
  };
}

type Methods = 'log' | 'warn' | 'error' | 'info' | 'debug' | 'time' | 'assert' | 'count' | 'table';
type TerminalMessageType = { method: Methods; data: any[] };
type TerminalMessagesType = TerminalMessageType[];

const Console: React.FC<{
  sourceCode: string;
  sourceCodeHash: null | number;
  fetchedReadme: string;
  onSetNotificationSettings: any;
  ownerId: string;
  user: any;
}> = ({ sourceCode, sourceCodeHash, ownerId, fetchedReadme, onSetNotificationSettings, user }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessagesType>([]);
  const [readMe, setReadMe] = useState<string>(fetchedReadme);
  const workerRef = useRef<any>(null);
  const classes = useStyles();
  const isAuthorize = !!user ? user.uid === ownerId : false;

  useEffect(() => {
    workerRef.current = new Worker(`${window.location.origin}/CodeEvaluatorWorker.js`);
    workerRef.current.addEventListener('message', function(e: { data: TerminalMessageType }) {
      setTerminalMessages((prevTerminalMessages: TerminalMessagesType) => [
        ...prevTerminalMessages,
        e.data,
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

  function toggleIsLoading(loading = false) {
    setIsLoading(loading);
  }

  function handleCloseSignInModal() {
    setIsSignInModalVisible(false);
  }

  function handleClearConsole() {
    setTerminalMessages([]);
  }

  function submitReadme() {
    toggleIsLoading(true);
    let me = Apis.users.getCurrentUser();
    if (!me) {
      setIsSignInModalVisible(true);
      return;
    }
    const id = getSourceCodeIdFromUrl();
    Apis.sourceCodes
      .saveSourceCode({
        data: { readme: readMe },
        params: { ID: id },
      })
      .then((res: any) => {
        toggleIsLoading();
      })
      .catch((error: any) => {
        toggleIsLoading();
        onSetNotificationSettings(error.message, 'danger', 'long');
      });
  }

  function renderConsoleClearedMessage() {
    return (
      <div
        className={`${classes.consoleTerminalLogMessages} ${classes.consoleTerminalClearMessage}`}>
        <Typography thickness="regular">Console was cleared</Typography>
      </div>
    );
  }

  function renderTerminal() {
    return (
      <div className={classes.consoleSection}>
        {renderConsoleClearedMessage()}
        <ConsoleFeeds
          logs={terminalMessages}
          variant="dark"
          styles={{ BASE_FONT_FAMILY: 'Eina regular', BASE_FONT_SIZE: '12.5px' }}
        />
      </div>
    );
  }

  function renderReadMe() {
    return (
      <div className={classes.consoleSection}>
        <textarea
          onChange={handleReadMeTextChange}
          required={true}
          className={classes.consoleReadMeTextarea}
          value={readMe}
          autoFocus={true}
          rows={7}
          placeholder="Add a ReadMe (Helps others understand your code. Markdown is supported)"></textarea>
        <ButtonWithLoading
          variant="contained"
          onClick={submitReadme}
          loading={isLoading}
          className={classes.saveReadmeButton}
          color="primary">
          save
        </ButtonWithLoading>
      </div>
    );
  }

  function renderPreview() {
    let isInCleanSlate = getSourcecodeUrl() === `${getBaseUrl()}/`;
    let optionalMessage = isInCleanSlate
      ? '**Please sign in and save your code to add a README**'
      : '**No README to display**';
    return (
      <div className={classes.consoleSection}>
        <div className={classes.consolePreview}>
          <MarDownRenderer source={readMe || optionalMessage} />
        </div>
      </div>
    );
  }

  function renderTerminalBasedActions() {
    return (
      currentTab === 0 && (
        <div className={classes.consoleTerminalBasedActionsContainer}>
          <ClearIcon className={classes.consoleTerminalClearIcon} onClick={handleClearConsole} />
        </div>
      )
    );
  }

  return (
    <section className={classes.console}>
      <div>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="console tabs">
          <Tab label="TERMINAL" {...a11yProps(0)} />
          {isAuthorize && <Tab label="READ ME" {...a11yProps(1)} />}
          <Tab label={isAuthorize ? 'PREVIEW' : 'READ ME'} {...a11yProps(2)} />
        </Tabs>
        {renderTerminalBasedActions()}
      </div>
      {currentTab === 0 && renderTerminal()}
      {currentTab === 1 && isAuthorize ? renderReadMe() : renderPreview()}
      {currentTab === 2 && renderPreview()}
      <SignInViaGithubModal
        visible={isSignInModalVisible}
        onRequestClose={handleCloseSignInModal}
        onSignInSuccess={submitReadme}
      />
    </section>
  );
};

export default React.memo(withNotificationBanner(Console));
