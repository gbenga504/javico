import React, { useState } from 'react';
import { Tooltip, makeStyles, Button } from '@material-ui/core';

import MenuBar from '../../components/MenuBar';
import MonacoEditor from '../../components/MonacoEditor';
import Console from '../../components/Console';
import Comments from '../../components/Comments';
import { color, useStyles as commonUseStyles, padding } from '../../Css';
import { IndeterminateLinearProgress, Icon } from '../../atoms';

const useStyles = makeStyles({
  main: {
    width: '100%',
  },
  relative: {
    position: 'relative',
  },
  mainRightSection: {
    flex: 1,
    height: '100%',
    borderLeft: `1px solid ${color.darkThemeLightBorder}`,
    minWidth: '50%',
    backgroundColor: color.darkThemeBlack,
    position: 'relative',
  },
  linearProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  switchButtonRoot: {
    position: 'absolute',
    zIndex: 1000,
    right: 10,
    top: 10,
    minWidth: 50,
    width: 50,
    ...padding(5, 'lr'),
    ...padding(0, 'tb'),
  },
  switchButtonLabel: {
    display: 'flex',
    flexDirection: 'column',
    '& ion-icon': {
      fontSize: 25,
    },
  },
  rightSubSection: {
    position: 'absolute',
    width: '100%',
    transition: 'all 0.6s',
  },
  showRightSubSection: {
    right: '0%',
    opacity: 1,
  },
  hideRightSubSection: {
    right: '-100%',
    opacity: 0,
  },
});

const Home: React.FC = () => {
  const [terminalExecutableCode, setTerminalExecutableCode] = useState('');
  const [currentSection, setCurrentSection] = useState('console');
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function handleToggleView() {
    setCurrentSection(currentSection === 'console' ? 'comments' : 'console');
  }

  function renderSwitchView() {
    return (
      <Tooltip title="Switch View" placement="left" enterDelay={100}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleToggleView}
          classes={{ root: classes.switchButtonRoot, label: classes.switchButtonLabel }}>
          <Icon name="ios-swap" />
        </Button>
      </Tooltip>
    );
  }

  return (
    <div className={`${classes.relative} ${commonCss.flexRow}`}>
      <div className={classes.linearProgress}>
        <IndeterminateLinearProgress isVisible={false} />
      </div>
      <MenuBar />
      <main className={`${classes.main} ${commonCss.flexRow}`}>
        <MonacoEditor onRunSourceCode={setTerminalExecutableCode} />
        <div className={classes.mainRightSection}>
          <div
            className={`${classes.rightSubSection} ${
              currentSection === 'console'
                ? classes.showRightSubSection
                : classes.hideRightSubSection
            }`}>
            <Console sourceCode={terminalExecutableCode} />
          </div>
          <div
            className={`${classes.rightSubSection} ${
              currentSection === 'comments'
                ? classes.showRightSubSection
                : classes.hideRightSubSection
            }`}>
            <Comments comments={[]} />
          </div>
          {renderSwitchView()}
        </div>
      </main>
    </div>
  );
};

export default Home;
