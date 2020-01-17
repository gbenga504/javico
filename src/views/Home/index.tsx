import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Tooltip, makeStyles, Button } from '@material-ui/core';

import MenuBar from '../../components/MenuBar';
import MonacoEditor from '../../components/MonacoEditor';
import Console from '../../components/Console';
import { color, useStyles as commonUseStyles, padding } from '../../Css';
import { IndeterminateLinearProgress, Icon, withNotificationBanner } from '../../atoms';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import SourceCodeService from '../../services/SourceCodeServices';
import { getIdFromUrl } from '../../utils/UrlUtils';

const Comments = lazy(() => import('../../components/Comments'));

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
    animationName: `$expandSwitchButton`,
    animationDuration: '2000ms',
    animationIterationCount: 'infinite',
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
  '@keyframes expandSwitchButton': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
});

interface IProps {
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const Home: React.FC<IProps> = ({ onSetNotificationSettings }) => {
  const [terminalExecutableCode, setTerminalExecutableCode] = useState('');
  const [currentSection, setCurrentSection] = useState('console');
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
    // eslint-disable-next-line
  }, []);

  function handleToggleView() {
    setCurrentSection(currentSection === 'console' ? 'comments' : 'console');
  }

  function toggleIsLoading(loading = false) {
    setisLoading(loading);
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
        <IndeterminateLinearProgress isVisible={isLoading} />
      </div>
      <MenuBar />
      <main className={`${classes.main} ${commonCss.flexRow}`}>
        <MonacoEditor
          onHandleLoading={toggleIsLoading}
          onRunSourceCode={setTerminalExecutableCode}
          fetchedSourceCode={fetchedSourceCode.sourceCode}
        />
        <div className={classes.mainRightSection}>
          <div
            className={`${classes.rightSubSection} ${
              currentSection === 'console'
                ? classes.showRightSubSection
                : classes.hideRightSubSection
            }`}>
            <Console sourceCode={terminalExecutableCode} fetchedReadme={fetchedSourceCode.readme} />
          </div>
          <div
            className={`${classes.rightSubSection} ${
              currentSection === 'comments'
                ? classes.showRightSubSection
                : classes.hideRightSubSection
            }`}>
            <Suspense fallback={null}>
              <Comments comments={[]} />
            </Suspense>
          </div>
          {renderSwitchView()}
        </div>
      </main>
    </div>
  );
};

export default withNotificationBanner(Home);
