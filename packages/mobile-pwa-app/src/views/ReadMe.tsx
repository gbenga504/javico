import React, { useState } from 'react';
import { Tabs, Tab, makeStyles } from '@material-ui/core';

import { color } from '../Css';

function a11yProps(index: number) {
  return {
    id: `readme-tab-${index}`,
    'aria-controls': `readme-tabpanel-${index}`,
  };
}

const ReadMe: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const classes = useStyles();

  function handleTabChange(event: React.ChangeEvent<{}>, currentTab: number) {
    setCurrentTab(currentTab);
  }

  return (
    <Tabs
      variant="fullWidth"
      value={currentTab}
      classes={{ root: classes.tabsRoot, indicator: classes.tabIndicator }}
      onChange={handleTabChange}
      aria-label="console tabs">
      <Tab
        classes={{
          wrapper: classes.tabWrapper,
          selected: classes.selectedTab,
          textColorInherit: classes.tabTextColorInherit,
        }}
        label="Edit"
        {...a11yProps(0)}
      />
      <Tab
        classes={{
          wrapper: classes.tabWrapper,
          selected: classes.selectedTab,
          textColorInherit: classes.tabTextColorInherit,
        }}
        label="Preview"
        {...a11yProps(1)}
      />
    </Tabs>
  );
};

const useStyles = makeStyles({
  tabsRoot: {
    borderBottom: `1px solid ${color.gray20}`,
  },
  tabIndicator: {
    marginLeft: '16%',
    width: '72px !important',
  },
  tabWrapper: {
    color: color.gray60,
  },
  selectedTab: {
    '& .MuiTab-wrapper': {
      color: color.themeBlue,
    },
  },
  tabTextColorInherit: {
    opacity: 1,
  },
});

export default ReadMe;
