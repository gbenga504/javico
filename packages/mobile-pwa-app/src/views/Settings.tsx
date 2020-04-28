import React from 'react';
import { makeStyles } from '@material-ui/core';
import { ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';
import {
  useStyles as commonUseStyles,
  color,
  fontsize,
} from '@javico/common/lib/design-language/Css';
import { Typography } from '@javico/common/lib/components';
import { Paths } from '../Routes';

const Settings: React.FC<{ history: any }> = ({ history }) => {
  const commonCss = commonUseStyles();
  const classes = useStyles();

  function handleNavigateToEditorView() {
    history.push(Paths.EDITOR);
  }

  function renderHeader() {
    return (
      <div className={`${commonCss.flexRow} ${classes.header} ${classes.addPadding}`}>
        <ArrowBackIosIcon className={classes.backIcon} onClick={handleNavigateToEditorView} />
        <Typography thickness="semi-bold" className={classes.titleText}>
          Settings
        </Typography>
      </div>
    );
  }

  function renderBody() {
    return (
      <div className={classes.addPadding}>
        <Typography className={classes.bodyText}>
          <Typography className={classes.bodyText} thickness="semi-bold">
            Javico (v0.0.1)
          </Typography>{' '}
          is an open source software built to aid people with experimenting quickly on their ideas
          by providing them with the statistics, data, community and workspace to quickly experiment
          on their ideas. Source code can be found on{' '}
          <Typography variant="a" href="https://github.com/gbenga504/javico" target="_blank">
            Github
          </Typography>
        </Typography>
      </div>
    );
  }

  return (
    <div className={`${commonCss.flexColumn} ${commonCss.fullHeightAndWidth}`}>
      {renderHeader()}
      {renderBody()}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  addPadding: {
    padding: theme.spacing(5, 4),
  },
  header: {
    alignItems: 'center',
    borderBottom: `1px solid ${color.gray20}`,
  },
  backIcon: {
    color: color.gray60,
  },
  titleText: {
    color: `${color.gray60} !important`,
    marginLeft: 15,
    fontSize: fontsize.large,
  },
  bodyText: {
    textAlign: 'justify',
    lineHeight: 1.8,
    color: `${color.gray60} !important`,
    '& a': {
      textDecoration: 'underline',
      color: `${color.themeBlue} !important`,
    },
  },
}));

export default Settings;
