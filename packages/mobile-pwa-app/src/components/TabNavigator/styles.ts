import { makeStyles } from '@material-ui/core';
import { color } from '@javico/common/lib/design-language/Css';

export const useStyles = makeStyles(theme => ({
  container: {
    background: color.white,
    width: '100%',
    padding: theme.spacing(0, 4),
    boxShadow: '0px -2px 3px -2.5px #bdbdbd',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  menuButton: {
    display: 'block',
    padding: theme.spacing(2),
  },
}));
