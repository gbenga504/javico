import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import MenuBar from '../../components/MenuBar';
import MonacoEditor from '../../components/MonacoEditor';
import Console from '../../components/Console';
import Comments from '../../components/Comments';
import { color, useStyles as commonUseStyles } from '../../Css';
import { IndeterminateLinearProgress } from '../../atoms';

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
  },
  linearProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
});

const Home: React.FC = () => {
  const [terminalExecutableCode, setTerminalExecutableCode] = useState('');
  const [isLoading, setisLoading] = useState<boolean>(false);
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function toggleIsLoading(loading = false) {
    setisLoading(loading);
  }

  return (
    <div className={`${classes.relative} ${commonCss.flexRow}`}>
      <div className={classes.linearProgress}>
        <IndeterminateLinearProgress isVisible={isLoading} />
      </div>
      <MenuBar />
      <main className={`${classes.main} ${commonCss.flexRow}`}>
        <MonacoEditor
          toggleIsLoading={toggleIsLoading}
          onRunSourceCode={setTerminalExecutableCode}
        />
        <div className={classes.mainRightSection}>
          <Console sourceCode={terminalExecutableCode} />
          <Comments comments={[]} />
        </div>
      </main>
    </div>
  );
};

export default Home;
