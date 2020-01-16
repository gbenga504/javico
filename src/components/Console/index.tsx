import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab } from '@material-ui/core';

import { useStyles } from './styles';
import { useStyles as commonUseStyles } from '../../Css';
import { Typography, Icon, withNotificationBanner, ButtonWithLoading } from '../../atoms';
import MarDownRenderer from '../MarkDownRenderer';
import { getIdFromUrl } from '../../utils/UrlUtils';
import { withApi } from '../../utils/ApiConnector';
import SignInViaGithubModal from '../SignInViaGithubModal';
import SourceCodeService from '../../services/SourceCodeServices';

const MessageType = {
  ERROR: `error`,
  LOG: `log`,
  WARNING: `warning`,
};

function a11yProps(index: number) {
  return {
    id: `console-tab-${index}`,
    'aria-controls': `console-tabpanel-${index}`,
  };
}

type TerminalMessageType = { type: string; message: string | any };
type TerminalMessagesType = TerminalMessageType[];

const Console: React.FC<{
  sourceCode: string;
  fetchedReadme: string;
  onSetNotificationSettings: any;
  ownerId: string;
  Api: any;
  user: any;
}> = ({ sourceCode, ownerId, fetchedReadme, onSetNotificationSettings, Api, user: _user }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessagesType>([]);
  const [readMe, setReadMe] = useState<string>(fetchedReadme);
  const [user, setUser] = useState<any>(_user);
  const workerRef = useRef<any>(null);
  const classes = useStyles();
  const commonCss = commonUseStyles();

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
    if (_user) {
      setUser(_user);
    } else {
      setUser(null);
      setCurrentTab(currentTab === 2 ? 1 : currentTab);
    }
    // eslint-disable-next-line
  }, [_user]);

  useEffect(() => {
    setTerminalMessages([]);
    workerRef.current.postMessage({ sourceCode });
  }, [sourceCode]);

  useEffect(() => {
    setReadMe(fetchedReadme);
  }, [fetchedReadme]);

  const isAuthorize = !!user ? user.uid === ownerId : false;

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

  function submitReadme() {
    toggleIsLoading(true);
    let me = Api.getCurrentUser();
    if (!me) {
      setIsSignInModalVisible(true);
      return;
    }
    const id = getIdFromUrl();
    SourceCodeService.saveSourceCode({
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

  function renderLogBasedMessages(message: string, index: number) {
    return (
      <div className={classes.consoleTerminalLogMessages} key={index}>
        <Typography thickness="semi-bold">{message}</Typography>
      </div>
    );
  }

  function renderWarningBasedMessages(message: string, index: number) {
    return (
      <div className={`${commonCss.flexRow} ${classes.consoleTerminalWarningMessages}`} key={index}>
        <div>
          <Icon className={classes.consoleTerminalWarningIcon} name="warning"></Icon>
        </div>
        <Typography color="warning" thickness="semi-bold">
          {message}
        </Typography>
      </div>
    );
  }

  function renderErrorBasedMessages(message: string, index: number) {
    return (
      <div className={`${commonCss.flexRow} ${classes.consoleTerminalErrorMessages}`} key={index}>
        <div>
          <Icon className={classes.consoleTerminalErrorIcon} name="close-circle"></Icon>
        </div>
        <Typography color="error" thickness="semi-bold">
          {message}
        </Typography>
      </div>
    );
  }

  function renderTerminal() {
    return (
      <div className={classes.consoleSection}>
        {terminalMessages.map((terminalMessage: TerminalMessageType, i: number) => {
          if (terminalMessage.type === MessageType.LOG) {
            return renderLogBasedMessages(terminalMessage.message, i);
          } else if (terminalMessage.type === MessageType.WARNING) {
            return renderWarningBasedMessages(terminalMessage.message, i);
          }
          return renderErrorBasedMessages(terminalMessage.message, i);
        })}
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
    return (
      <div className={classes.consoleSection}>
        <div className={classes.consolePreview}>
          <MarDownRenderer source={readMe} />
        </div>
      </div>
    );
  }

  return (
    <section className={classes.console}>
      <Tabs value={currentTab} onChange={handleTabChange} aria-label="console tabs">
        <Tab label="TERMINAL" {...a11yProps(0)} />
        {isAuthorize && <Tab label="READ ME" {...a11yProps(1)} />}
        <Tab label={isAuthorize ? 'PREVIEW' : 'READ ME'} {...a11yProps(2)} />
      </Tabs>
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

export default withNotificationBanner(withApi(Console));
