import { createMuiTheme, makeStyles } from '@material-ui/core';

export const color = {
  white: '#fff',
  black: '#000',
  deepBlue: '#1A1D21',
  themeBlue: '#0076c6',
  themeBlueLighter: '#d4edfb',
  themeBlueDarker: '#0D47A1',
  darkThemeLightBorder: 'rgba(255, 255, 255, 0.07)',
  darkThemeDarkBorder: 'rgba(255, 255, 255, 0.4)',
  darkThemeMenubarIcon: 'rgba(255, 255, 255, 0.4)',
  darkThemeBlack: '#1e1e1e',
  warningLight: 'rgb(247, 168, 41)',
  warningDark: '#715f1a',
  errorLight: 'rgb(214, 118, 116)',
  errorDark: '#310e0e',
  success: '#1B5E20',
  alertDanger: '#DD2C00',
  gray20: '#eee', // Google gray color 200
  gray60: '#757575', //Google gray color 600,
  focused: '#80dbff',
  imageBackground: '#757575',
};

export const fontsize = {
  xsmall: 12,
  small: 13,
  base: 14,
  large: 18,
  xlarge: 20,
  terminal: 12.5,
};

const baseSpacing = 24;
export const spacing = {
  base: baseSpacing,
  units: (unit: number) => baseSpacing + unit * 4,
};

export const fonts = {
  light: 'Eina Light',
  regular: 'Eina Regular',
  semiBold: 'Eina SemiBold',
  bold: 'Eina Bold',
};

const palette = {
  primary: {
    dark: color.themeBlueDarker,
    main: color.themeBlue,
  },
  secondary: {
    main: color.themeBlue,
  },
};

export const theme = createMuiTheme({
  overrides: {
    MuiTabs: {
      indicator: {
        backgroundColor: color.white,
        height: 1,
      },
    },
    MuiTab: {
      root: {
        color: `${color.white} !important`,
        fontSize: `11px !important`,
        fontFamily: `${fonts.semiBold} !important`,
      },
    },
    MuiMenu: {
      list: {
        padding: 0,
      },
    },
    MuiMenuItem: {
      root: {
        fontFamily: fonts.regular,
        fontSize: fontsize.small,
      },
    },
    MuiFab: {
      root: {
        background: color.themeBlue,
        '&:hover': {
          background: color.themeBlueDarker,
        },
      },
    },
    MuiDialog: {
      paper: {
        width: 600,
      },
    },
    MuiDialogTitle: {
      root: {
        marginBottom: '5px',
        padding: '15px 24px',
        borderBottom: '1px solid #e0e0e0',
        '& span': {
          fontSize: fontsize.base,
          fontFamily: fonts.semiBold,
        },
      },
    },
    MuiDialogContent: {
      root: {
        fontSize: 15,
      },
    },
    MuiButton: {
      root: {
        width: 100,
        fontSize: fontsize.base,
        fontFamily: fonts.semiBold,
        textTransform: 'capitalize',
      },
    },
  },
  palette,
  spacing: 4,
});

export const useStyles = makeStyles({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullHeightAndWidth: {
    width: '100%',
    height: '100%',
  },
  cancelButton: {
    marginRight: 5,
  },
  fullWidth: {
    width: '100%',
  },
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
  },
  focused: {
    border: color.focused,
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,0.25)',
  },
});

export function spacingHelper(type: string, units?: number, directions?: string): any {
  units = units !== undefined ? units : baseSpacing;
  directions = directions || 'blrt';
  const rules: any = {};
  if (directions.indexOf('b') > -1) {
    rules[`${type}Bottom`] = units;
  }
  if (directions.indexOf('l') > -1) {
    rules[`${type}Left`] = units;
  }
  if (directions.indexOf('r') > -1) {
    rules[`${type}Right`] = units;
  }
  if (directions.indexOf('t') > -1) {
    rules[`${type}Top`] = units;
  }
  return rules;
}

export function padding(units?: number, directions?: string): any {
  return spacingHelper('padding', units, directions);
}

export function margin(units?: number, directions?: string): any {
  return spacingHelper('margin', units, directions);
}
