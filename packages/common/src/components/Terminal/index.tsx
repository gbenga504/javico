import React from "react";
import { makeStyles } from "@material-ui/core";
import { Console as ConsoleFeeds } from "console-feed";

import Typography from "../Typography";
import { color, fontsize } from "../../design-language/Css";
import { NotInterested as ClearIcon } from "@material-ui/icons";

type Methods =
  | "log"
  | "warn"
  | "error"
  | "info"
  | "debug"
  | "time"
  | "assert"
  | "count"
  | "table";
type TerminalMessageType = { method: Methods; data: any[]; id: string };
type TerminalMessagesType = TerminalMessageType[];

const Terminal: React.FC<{
  terminalMessages: TerminalMessagesType;
  onClearConsole: () => void;
}> = ({ terminalMessages, onClearConsole }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.consoleTerminalLogMessages}>
        <Typography
          className={classes.consoleTerminalClearMessage}
          thickness="regular"
        >
          Clear console
          <ClearIcon
            className={classes.consoleTerminalClearIcon}
            onClick={onClearConsole}
          />
        </Typography>
        <ConsoleFeeds
          logs={terminalMessages}
          variant="dark"
          styles={{
            BASE_FONT_FAMILY: "Eina regular",
            BASE_FONT_SIZE: "12.5px"
          }}
        />
      </div>
    </>
  );
};

const useStyles = makeStyles({
  consoleTerminalClearMessage: {
    fontStyle: "italic",
    display: "flex",
    alignItems: "center"
  },
  consoleTerminalLogMessages: {
    padding: "3px 15px",
    fontSize: `${fontsize.terminal}px !important`,
    border: `1px solid ${color.darkThemeLightBorder}`,
    height: "100%"
  },
  consoleTerminalClearIcon: {
    color: color.white,
    fontSize: 16,
    cursor: "pointer",
    marginLeft: 5
  }
});

export default React.memo(Terminal);
