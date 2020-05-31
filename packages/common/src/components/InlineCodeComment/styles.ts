import { makeStyles } from "@material-ui/core";

import { color, fontsize, fonts } from "../../design-language/Css";

export const useStyles = makeStyles(theme => ({
  commentBoxContainer: {
    position: "absolute",
    background: "transparent",
    zIndex: 2,
    width: "100%",
    left: 0
  },
  commentForm: {
    position: "relative",
    backgroundColor: color.gray20,
    padding: 12,
    borderRadius: 5
  },
  inlineCommentContainer: {
    backgroundColor: color.white,
    borderRadius: 5,
    textAlign: "left",
    width: "100%",
    minHeight: 50,
    fontSize: fontsize.base,
    padding: 12,
    zIndex: 99999,
    "& > textarea": {
      width: "100%",
      border: 0,
      fontFamily: fonts.regular,
      fontSize: fontsize.base,
      outline: "none",
      resize: "none"
    },
    "& .inline-comment__header": {
      borderBottom: `1px solid ${color.gray20}`,
      marginBottom: 5
    },
    "& .inline-comment__footer": {
      borderTop: `1px solid ${color.gray20}`,
      paddingTop: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  },
  nothingToPreview: {
    color: `${color.black} !important`,
    fontSize: fontsize.base
  },
  markdownLink: {
    color: `${color.themeBlueDarker} !important`,
    fontSize: fontsize.small,
    fontFamily: `${fonts.semiBold} !important`,
    textDecoration: "none",
    display: "flex",
    alignItems: "center"
  },
  openInNewIcon: {
    fontSize: 16,
    marginBottom: 3,
    marginLeft: 3
  }
}));
