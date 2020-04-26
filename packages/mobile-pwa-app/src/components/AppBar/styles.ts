import { makeStyles } from '@material-ui/core';

import { color, fontsize, fonts } from '../../Css';

export const useStyles = makeStyles(theme => ({
  container: {
    background: color.white,
    width: '100%',
    padding: theme.spacing(2, 4),
  },
  appBar: {
    borderRadius: 5,
    background: color.white,
    padding: theme.spacing(2, 3),
    border: '1px solid #E0E0E0',
    alignItems: 'center',
    boxShadow: '2px 2px 3px -2.5px #bdbdbd, -2px -2px 3px -2.5px #bdbdbd',
  },
  avatarContainer: {
    background: color.imageBackground,
    width: 30,
    height: 30,
    borderRadius: '50%',
    '& img': {
      width: 'inherit',
      height: 'inherit',
      borderRadius: '50%',
    },
  },
  searchInput: {
    flex: 1,
    outline: 'none',
    fontSize: fontsize.base,
    fontFamily: fonts.regular,
    marginLeft: 10,
    color: color.gray60,
    border: 0,
    padding: 0,
  },
}));
