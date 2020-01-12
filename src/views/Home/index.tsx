import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

import MenuBar from '../../components/MenuBar';
import MonacoEditor from '../../components/MonacoEditor';
import Console from '../../components/Console';
import Comments from '../../components/Comments';
import { color, useStyles as commonUseStyles } from '../../Css';
import { IndeterminateLinearProgress, withNotificationBanner } from '../../atoms';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import SourceCodeService from '../../services/SourceCodeServices';
import { getIdFromUrl } from '../../utils/Misc';

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

interface IProps {
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const Home: React.FC<IProps> = ({ onSetNotificationSettings }) => {
  const [terminalExecutableCode, setTerminalExecutableCode] = useState('');
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [fetchedSourceCode, setFetchedSourceCode] = useState({
    sourceCode: '',
    readme: '',
  });
  const classes = useStyles();
  const commonCss = commonUseStyles();

  useEffect(() => {
    if (getIdFromUrl()) {
      toggleIsLoading(true);
      SourceCodeService.fetchSourceCode({
        params: { ID: getIdFromUrl() },
      })
        .then(res => {
          const { sourceCode, readme } = res._document.proto.fields;
          toggleIsLoading();
          setFetchedSourceCode({ sourceCode: sourceCode.stringValue, readme: readme.stringValue });
        })
        .catch((error: any) => {
          toggleIsLoading();
          onSetNotificationSettings(error.message, 'danger', 'long');
        });
    }
  }, [onSetNotificationSettings]);

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
          fetchedSourceCode={fetchedSourceCode.sourceCode}
        />
        <div className={classes.mainRightSection}>
          <Console sourceCode={terminalExecutableCode} fetchedReadme={fetchedSourceCode.readme} />
          <Comments comments={[]} />
        </div>
      </main>
    </div>
  );
};

export default withNotificationBanner(Home);
