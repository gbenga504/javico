import React, { useState, useEffect, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import './index.css';
import Typography from '../../atoms/Typography';
import Icon from '../../atoms/Icon';

const styles = {
  consoleTabWrapper: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Eina semiBold',
  },
  consoleTabsindicator: {
    backgroundColor: '#fff',
    height: 1,
  },
};

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

const Console: React.FC<{ classes: any; sourceCode: string }> = ({ classes, sourceCode }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const workerRef = useRef<any>(null);
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessagesType>([]);

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
      <div className="console__terminal-log-messages" key={index}>
        <Typography thickness="semi-bold">{message}</Typography>
      </div>
    );
  }

  function renderWarningBasedMessages(message: string, index: number) {
    return (
      <div className="console__terminal-warning-messages" key={index}>
        <div>
          <Icon className="console__terminal-warning-icon" name="warning"></Icon>
        </div>
        <Typography color="warning" thickness="semi-bold">
          {message}
        </Typography>
      </div>
    );
  }

  function renderErrorBasedMessages(message: string, index: number) {
    return (
      <div className="console__terminal-error-messages" key={index}>
        <div>
          <Icon className="console__terminal-error-icon" name="close-circle"></Icon>
        </div>
        <Typography color="error" thickness="semi-bold">
          {message}
        </Typography>
      </div>
    );
  }

  function renderTerminal() {
    return currentTab === 1 ? (
      <div className="console__terminal">
        {terminalMessages.map((terminalMessage: TerminalMessageType, i: number) => {
          if (terminalMessage.type === MessageType.LOG) {
            return renderLogBasedMessages(terminalMessage.message, i);
          } else if (terminalMessage.type === MessageType.WARNING) {
            return renderWarningBasedMessages(terminalMessage.message, i);
          }
          return renderErrorBasedMessages(terminalMessage.message.stack, i);
        })}
      </div>
    ) : null;
  }

  return (
    <section className="console">
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="console tabs"
        classes={{ indicator: classes.consoleTabsindicator }}>
        <Tab label="PROBLEMS" {...a11yProps(0)} classes={{ wrapper: classes.consoleTabWrapper }} />
        <Tab label="TERMINAL" {...a11yProps(1)} classes={{ wrapper: classes.consoleTabWrapper }} />
      </Tabs>
      {renderTerminal()}
    </section>
  );
};

export default withStyles(styles)(Console);
