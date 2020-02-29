import { makeStyles } from "@material-ui/core";

import { color, fontsize } from "../../Css";

export const useStyles = makeStyles(theme => ({
  monacoEditorContainer: {
    width: "50%",
    position: "relative",
    background: color.darkThemeBlack
  },
  monacoEditorTitleHead: {
    height: 30,
    display: "flex",
    alignItems: "center",
    backgroundColor: color.darkThemeLightBorder
  },
  monacoEditorTitle: {
    color: "white",
    display: "flex",
    alignItems: "center",
    backgroundColor: color.deepBlue,
    height: "100%",
    cursor: "default",
    padding: 10,
    "& .comment__hide-title-menu-icon": {
      cursor: "pointer",
      fontSize: 20,
      display: "none"
    },
    "&:hover .comment__hide-title-menu-icon": {
      display: "block"
    }
  },
  monacoEditorRenameTitleInput: {
    backgroundColor: "transparent",
    outline: "none",
    color: color.white,
    fontSize: 14,
    border: "none"
  },
  titleMenuPaper: {
    backgroundColor: color.deepBlue
  },
  titleMenuList: {
    backgroundColor: color.darkThemeLightBorder,
    color: color.white,
    "&:hover": {
      backgroundColor: color.deepBlue
    }
  },
  monacoEditor: {
    flex: 1,
    height: "93%"
  },
  monacoEditorRunButtonIcon: {
    color: color.white,
    fontSize: fontsize.xlarge * 2,
    marginLeft: 2
  },
  monacoEditorCodeComment: {
    height: 100,
    width: 500
  },
  monacoEditorCodeCommentIcon: {
    position: "absolute",
    backgroundColor: color.white,
    cursor: "pointer",
    borderRadius: "50%",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
  },
  monacoEditorHighlightMainContent: {
    backgroundColor: "#074e68",
    color: "#fff !important"
  },
  monacoEditorHighlightRemainingContent: {
    backgroundColor: "#8adaf7",
    color: "black !important"
  },
  monacoEditorRunButton: {
    position: "absolute",
    bottom: 15,
    right: "50%",
    zIndex: 2000
  }
}));
