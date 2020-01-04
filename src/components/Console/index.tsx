import React, { useState, useEffect, useRef } from 'react';
import { Button, Tabs, Tab } from '@material-ui/core';

import { useStyles } from './styles';
import { useStyles as commonUseStyles } from '../../Css';
import { Typography, Icon } from '../../atoms';
import MarDownRenderer from '../MarkDownRenderer';
import sourceCodeService from '../../services/sourceCodeServices';

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

const Console: React.FC<{ sourceCode: string }> = ({ sourceCode }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessagesType>([]);
  const [readMe, setReadMe] = useState<string>('');
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
    setTerminalMessages([]);
    workerRef.current.postMessage({ sourceCode });
  }, [sourceCode]);

  function handleTabChange(event: React.ChangeEvent<{}>, currentTab: number) {
    setCurrentTab(currentTab);
  }

  function handleReadMeTextChange(e: any) {
    setReadMe(e.target.value);
  }

  function submitReadme() {
    sourceCodeService.updateSourceCode({
      id: '',
      readMe,
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
        <div className={classes.saveReadme}>
          <Button
            variant="contained"
            onClick={submitReadme}
            className={classes.saveReadmeButton}
            color="primary">
            save
          </Button>
        </div>
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
        <Tab label="READ ME" {...a11yProps(1)} />
        <Tab label="PREVIEW" {...a11yProps(2)} />
      </Tabs>
      {currentTab === 0
        ? renderTerminal()
        : currentTab === 1
        ? renderReadMe()
        : currentTab === 2
        ? renderPreview()
        : null}
    </section>
  );
};

export default Console;
