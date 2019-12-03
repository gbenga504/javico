import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import './index.css';

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

function a11yProps(index: number) {
  return {
    id: `console-tab-${index}`,
    'aria-controls': `console-tabpanel-${index}`,
  };
}

const Console: React.FC<{ classes: any }> = ({ classes }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, currentTab: number) => {
    setCurrentTab(currentTab);
  };

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
    </section>
  );
};

export default withStyles(styles)(Console);
