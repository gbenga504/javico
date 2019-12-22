import React, { useState, useEffect, useRef } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useStyles } from './styles';
import { useStyles as commonUseStyles } from '../../Css';
import { Typography, Icon } from '../../atoms';

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
  const [currentTab, setCurrentTab] = useState(0);
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessagesType>([]);
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
    return currentTab === 1 ? (
      <div className={classes.consoleTerminal}>
        {terminalMessages.map((terminalMessage: TerminalMessageType, i: number) => {
          if (terminalMessage.type === MessageType.LOG) {
            return renderLogBasedMessages(terminalMessage.message, i);
          } else if (terminalMessage.type === MessageType.WARNING) {
            return renderWarningBasedMessages(terminalMessage.message, i);
          }
          return renderErrorBasedMessages(terminalMessage.message, i);
        })}
      </div>
    ) : null;
  }

  return (
    <section className={classes.console}>
      <Tabs value={currentTab} onChange={handleTabChange} aria-label="console tabs">
        <Tab label="PROBLEMS" {...a11yProps(0)} />
        <Tab label="TERMINAL" {...a11yProps(1)} />
      </Tabs>
      {renderTerminal()}
    </section>
  );
};

export default Console;
