import React, { useEffect, useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';

import Home from './views/Home';
import { NotificationProvider } from './atoms';
import { theme } from './Css';
import NotOptimizedForMobile from './components/NotOptimizedForMobile';

const App: React.FC = () => {
  const [isUIVisible, setIsUIVisible] = useState<boolean>(window.innerWidth < 992 ? false : true);

  useEffect(() => {
    function resize() {
      if (window.innerWidth < 992 && isUIVisible === true) {
        setIsUIVisible(false);
      } else if (window.innerWidth >= 992 && isUIVisible === false) {
        setIsUIVisible(true);
      }
    }
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [isUIVisible]);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: isUIVisible === true ? 'block' : 'none',
        }}>
        <MuiThemeProvider theme={theme}>
          <NotificationProvider>
            <Home />
          </NotificationProvider>
        </MuiThemeProvider>
      </div>
      {isUIVisible === false && <NotOptimizedForMobile />}
    </>
  );
};

export default App;
