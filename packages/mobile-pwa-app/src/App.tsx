import React from 'react';
import { MuiThemeProvider, makeStyles } from '@material-ui/core';
import { theme } from '@javico/common/lib/design-language/Css';

import Routes from './Routes';

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container}>
        <Routes />
      </div>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
});

export default React.memo(App);
