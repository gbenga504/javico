import React, { useState, useRef } from "react";
import { Paper, Button, Tabs, Tab, withStyles } from "@material-ui/core";
import { OpenInNew as OpenInNewIcon } from "@material-ui/icons";

import { useStyles } from "./styles";
import { IBannerStyle, IDuration } from "../../atoms/NotificationBanner";
import {
  withNotificationBanner,
  Typography,
  ButtonWithLoading
} from "../../atoms";
import { useStyles as commonUseStyles, color, fontsize } from "../../Css";
import MarkdownRenderer from "../MarkDownRenderer";
import { Apis } from "../../utils/Apis";

interface IProps {
  user: any;
  onHideCommentBox: any;
  mousePosition: any;
  onOpenSignInModal: () => null;
  sourceCodeId: string;
  codeReference: string;
  onSetNotificationSettings: (
    text: string,
    style?: IBannerStyle,
    duration?: IDuration
  ) => null;
  currentSection: "comments" | "console";
  onChangeCurrentSection: () => void;
}

const MuiTabs = withStyles({
  root: {
    minHeight: 0
  },
  indicator: {
    backgroundColor: color.themeBlue,
    height: 2,
    minWidth: 80
  }
})(Tabs);

const MuiTab = withStyles({
  root: {
    color: `${color.gray60} !important`,
    padding: 0,
    minHeight: 31,
    minWidth: 80,
    fontSize: `${fontsize.small}px !important`,
    textTransform: "capitalize !important"
  },
  selected: {
    color: `${color.black} !important`
  }
} as any)(Tab);

function a11yProps(index: number) {
  return {
    id: `inline-comment-tab-${index}`,
    "aria-controls": `inline-comment-tabpanel-${index}`
  };
}

const InlineCodeComment: React.FC<IProps> = ({
  user,
  onOpenSignInModal,
  onHideCommentBox,
  mousePosition,
  sourceCodeId,
  codeReference,
  onSetNotificationSettings,
  currentSection,
  onChangeCurrentSection
}) => {
  const [comment, setComment] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [isCreatingComment, setIsCreatingComment] = useState<boolean>(false);
  const [isCommentBoxFocused, setIsCommentBoxFocused] = useState(true);
  const commentRef = useRef<any>(null);
  const commonCss = commonUseStyles();
  const classes = useStyles();

  function handleChange(e: any) {
    setComment(e.target.value);
  }

  function handleSubmitComment(e: any) {
    e.preventDefault();
    if (!commentRef.current.reportValidity()) {
      return;
    }
    if (!user) {
      onOpenSignInModal();
    } else {
      setIsCreatingComment(true);
      Apis.comments
        .createComment({
          data: {
            sourceCodeId,
            author: {
              id: user.uid,
              name: user.displayName,
              photoURL: user.photoURL
            },
            text: comment,
            codeReference
          },
          params: {
            sourceCodeID: sourceCodeId
          }
        })
        .then(res => {
          setIsCreatingComment(false);
          onHideCommentBox();
          handleCancelComment(res);
          currentSection !== "comments" && onChangeCurrentSection();
        })
        .catch(err => {
          setIsCreatingComment(false);
          onSetNotificationSettings(err, "danger", "long");
        });
    }
  }

  function handleCancelComment(e: any) {
    setComment("");
    onHideCommentBox();
  }

  function handleTabChange(event: React.ChangeEvent<{}>, currentTab: number) {
    setCurrentTab(currentTab);
  }

  function handleFocusCodeCommentContainer() {
    setIsCommentBoxFocused(true);
  }

  function handleBlurCodeCommentContainer() {
    setIsCommentBoxFocused(false);
  }

  function renderWriteComment() {
    return (
      <>
        <textarea
          onChange={handleChange}
          required={true}
          value={comment}
          autoFocus={true}
          onFocus={handleFocusCodeCommentContainer}
          onBlur={handleBlurCodeCommentContainer}
          rows={7}
          placeholder="Drop your comment"
        ></textarea>
        <div className="inline-comment__footer">
          <Typography
            variant="a"
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            className={classes.markdownLink}
          >
            Markdown is supported
            <OpenInNewIcon className={classes.openInNewIcon} />
          </Typography>
          <div className={commonCss.flexRow}>
            <Button
              className={commonCss.cancelButton}
              onClick={handleCancelComment}
            >
              Cancel
            </Button>
            <ButtonWithLoading
              loading={isCreatingComment}
              color="primary"
              variant="contained"
              onClick={handleSubmitComment}
            >
              Comment
            </ButtonWithLoading>
          </div>
        </div>
      </>
    );
  }

  function renderPreviewComment() {
    return comment.length === 0 ? (
      <Typography className={classes.nothingToPreview}>
        Nothing to preview.
      </Typography>
    ) : (
      <MarkdownRenderer source={comment} linkTarget="_blank" />
    );
  }

  return (
    <div
      className={`${classes.commentBoxContainer} ${commonCss.fullHeightAndWidth}`}
    >
      <Paper
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.commentBox}
        style={{
          top: mousePosition.y + 20
        }}
      >
        <form
          ref={commentRef}
          onSubmit={e => e.preventDefault()}
          className={commonCss.flexRow}
        >
          <div className={commonCss.fullWidth}>
            <div
              className={`${classes.inlineCommentContainer} ${
                commonCss.relative
              } ${isCommentBoxFocused && commonCss.focused}`}
            >
              <div className="inline-comment__header">
                <MuiTabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="inline comment tabs"
                >
                  <MuiTab label="Write" {...a11yProps(0)} />
                  <MuiTab label="Preview" {...a11yProps(1)} />
                </MuiTabs>
              </div>
              {currentTab === 0 ? renderWriteComment() : renderPreviewComment()}
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default React.memo(withNotificationBanner(InlineCodeComment));