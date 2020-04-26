import React from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Title as TitleIcon,
  Share as ShareIcon,
  DeviceHub as ForkIcon,
  NoteAdd as AddNewIcon,
} from '@material-ui/icons';
import { Typography } from '@javico/common/lib/components';
import {
  useStyles as commonUseStyles,
  color,
  fontsize,
} from '@javico/common/lib/design-language/Css';

import DraggableListener from '../atoms/DraggableListener';

type Action = 'changeTitle' | 'share' | 'forkCode' | 'addNew';
interface IProps {
  onRequestClose: () => void;
  isVisible: boolean;
}
interface IAction {
  text: string;
  action: Action;
  icon: any;
}

const actionList = [
  { text: 'Change Title', action: 'changeTitle', icon: TitleIcon },
  { text: 'Share', action: 'share', icon: ShareIcon },
  { text: 'Fork Code', action: 'forkCode', icon: ForkIcon },
  { text: 'Add', action: 'addNew', icon: AddNewIcon },
] as Array<IAction>;

const ActionsModal: React.FC<IProps> = ({ onRequestClose, isVisible }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function renderAction(action: IAction, index: number) {
    let Icon = action.icon;
    return (
      <div
        key={index}
        className={`${commonCss.flexColumn} ${commonCss.center} ${classes.actionContainer}`}>
        <div className={`${commonCss.flexRow} ${commonCss.center} action-icon-container`}>
          <Icon style={{ color: color.gray60 }} />
        </div>
        <Typography className={classes.actionText}>{action.text}</Typography>
      </div>
    );
  }

  return (
    <DraggableListener
      className={`${commonCss.flexColumn} ${classes.container}`}
      isVisible={isVisible}
      onRequestClose={onRequestClose}>
      <Typography className={classes.title}>Actions</Typography>
      <div className={`${commonCss.flexRow} ${classes.content}`}>
        {actionList.map((action, index) => renderAction(action, index))}
      </div>
    </DraggableListener>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3, 5),
  },
  title: {
    textAlign: 'center',
    color: '#373737 !important',
  },
  content: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionContainer: {
    margin: '10px 0',
    width: 100,
    '& .action-icon-container': {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: `1px solid ${color.gray60}`,
    },
  },
  actionText: {
    marginTop: 2,
    fontSize: fontsize.xsmall,
    color: `${color.gray60} !important`,
  },
}));

export default ActionsModal;
