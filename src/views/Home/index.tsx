import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import MenuBar from '../../components/MenuBar';
import MonacoEditor from '../../components/MonacoEditor';
import Console from '../../components/Console';
import Comments from '../../components/Comments';
import { color, useStyles as commonUseStyles } from '../../Css';

const useStyles = makeStyles({
  main: {
    width: '100%',
  },
  mainRightSection: {
    flex: 1,
    height: '100%',
    borderLeft: `1px solid ${color.darkThemeLightBorder}`,
    minWidth: '50%',
    backgroundColor: color.darkThemeBlack,
  },
});

const Home: React.FC = () => {
  const [terminalExecutableCode, setTerminalExecutableCode] = useState('');
  const classes = useStyles();
  const commonCss = commonUseStyles();

  return (
    <div className={commonCss.flexRow}>
      <MenuBar />
      <main className={`${classes.main} ${commonCss.flexRow}`}>
        <MonacoEditor onRunSourceCode={setTerminalExecutableCode} />
        <div className={classes.mainRightSection}>
          <Console sourceCode={terminalExecutableCode} />
          <Comments comments={[]} />
        </div>
      </main>
    </div>
  );
};

export default Home;
