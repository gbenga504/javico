import React from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider, makeStyles } from '@material-ui/core';
import { theme } from '@javico/common/lib/design-language/Css';

import Routes from './Routes';
import store from './redux/store';

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <div className={classes.container}>
          <Routes />
        </div>
      </MuiThemeProvider>
    </Provider>
  );
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    overflowY: 'hidden',
  },
});

export default React.memo(App);
