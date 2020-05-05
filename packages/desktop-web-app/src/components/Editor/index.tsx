import React, { useEffect, useState, useRef } from "react";
import { Fab, makeStyles } from "@material-ui/core";
import { PlayArrow as PlayArrowIcon } from "@material-ui/icons";
import { useSelector } from "react-redux";
import {
  IBannerStyle,
  IDuration,
  withNotificationBanner
} from "@javico/common/lib/components/NotificationBanner";
import { InlineCodeComment, MonacoEditor } from "@javico/common/lib/components";
import {
  Apis,
  getSourceCodeIdFromUrl,
  updateUrl
} from "@javico/common/lib/utils";
import { color, fontsize } from "@javico/common/lib/design-language/Css";

import SourceCodeHeading from "./SourceCodeHeading";
import SignInViaGithubHandler from "../SignInViaGithubHandler";
import * as Constants from "../../utils/Constants";
import { getCurrentUserState } from "../../redux/auth/reducers";
import ResizeListener from "./ResizeListener";

interface IProps {
  value?: string;
  onRunSourceCode?: ({
    sourceCode,
    sourceCodeHash
  }: {
    sourceCode: string;
    sourceCodeHash: number;
  }) => void;
  theme?: "light" | "dark" | "ace" | "night-dark";
  language?: string;
  toggleProgressBarVisibility: (isFetching: boolean) => void;
  sourceCodeMetaData: Constants.ISourceCodeMetaData;
  updateSourceCodeMetaData: (data: {
    sourceCode: string;
    ownerId: string;
    sourceCodeId: string;
  }) => void;
  isFetchingSourceCodeMetaData: boolean;
  onSetNotificationSettings: (
    text: string,
    style?: IBannerStyle,
    duration?: IDuration
  ) => null;
  currentRightSection: string;
  changeCurrentRightSection: () => void;
  fetchSourceCodeMetaData: () => void;
}

const Editor: React.FC<IProps> = ({
  onRunSourceCode,
  onSetNotificationSettings,
  updateSourceCodeMetaData,
  isFetchingSourceCodeMetaData,
  currentRightSection,
  changeCurrentRightSection,
  fetchSourceCodeMetaData,
  toggleProgressBarVisibility,
  sourceCodeMetaData
}) => {
  const [selectionValue, setSelectionValue] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(
    false
  );
  const [commentAnchorDistanceY, setCommentAnchorDistanceY] = useState<
    number | null
  >(null);
  const currentUser = useSelector(getCurrentUserState);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(
    false
  );
  const [disableDragforward, setDisableDragforward] = useState<boolean>(false);
  const [currentEditorBoundary, setCurrentEditorBoundary] = useState<any>({});
  const [sourceCode, setSourceCode] = useState<string>("");
  const [resizeWidth, setResizeWidth] = useState<any>("50%");
  const editorRef = useRef<any>(null);
  const monacoEditorContainerRef = useRef<any>();
  const editorInnerwidthRef = useRef<number>();
  const classes = useStyles();
  const {
    sourceCode: fetchedSourceCode,
    ownerId,
    title: sourceCodeTitle,
    sourceCodeId,
    readme
  } = sourceCodeMetaData || {};

  function getEditorBoundary() {
    if (monacoEditorContainerRef.current)
      return monacoEditorContainerRef.current.getBoundingClientRect();
    return {};
  }

  useEffect(() => {
    editorInnerwidthRef.current = resizeWidth;
    if (resizeWidth > monacoEditorContainerRef.current.clientWidth) {
      setDisableDragforward(true);
      setResizeWidth(monacoEditorContainerRef.current.clientWidth);
    }
  }, [resizeWidth]);

  useEffect(() => {
    if (monacoEditorContainerRef.current) {
      setCurrentEditorBoundary(getEditorBoundary());
      setResizeWidth(getEditorBoundary().width);
    }
  }, []);

  useEffect(() => {
    let editor = editorRef.current;
    if (editor !== null && !!editor.getEditorRef() === true) {
      editor
        .getEditorRef()
        .getModel()
        .setValue(fetchedSourceCode);
    }
  }, [fetchedSourceCode]);

  useEffect(() => {
    if (!!currentUser === true && !!ownerId === true) {
      editorRef.current.disableEditor(currentUser.uid !== ownerId);
    } else if (!!currentUser === false && !!ownerId === true) {
      editorRef.current.disableEditor(true);
    } else {
      editorRef.current.disableEditor(false);
    }
  }, [currentUser, ownerId]);

  function handleSourceCodeExecution(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    onRunSourceCode &&
      onRunSourceCode({ sourceCode, sourceCodeHash: Date.now() });
  }

  function handleSourceCodeChange(value: string) {
    setSourceCode(value);
  }

  function handleCodeHighlight(
    highlightedValue: string,
    anchorEl: HTMLDivElement | null,
    distanceY: number
  ) {
    setSelectionValue(highlightedValue);
    setCommentAnchorDistanceY(distanceY);
  }

  function handleCloseInlineCodeComment() {
    setCommentAnchorDistanceY(null);
    editorRef.current
      .getEditorRef()
      .getModel()
      .setValue(sourceCode);
  }

  function updateSourcecode(id: string, data: { sourceCode: string }) {
    toggleProgressBarVisibility(true);
    Apis.sourceCodes
      .saveSourceCode({
        data,
        params: { ID: id }
      })
      .then(() => {
        fetchSourceCodeMetaData();
      })
      .catch((error: any) => {
        toggleProgressBarVisibility(false);
        onSetNotificationSettings(error.message, "danger", "long");
      });
  }

  function saveNewSourcecode(data: any) {
    let me = Apis.users.getCurrentUser();
    toggleProgressBarVisibility(true);
    Apis.sourceCodes
      .saveSourceCode({
        data: {
          ownerId: me.uid,
          ...data
        }
      })
      .then(res => {
        toggleProgressBarVisibility(false);
        updateSourceCodeMetaData({
          sourceCode,
          ownerId: me.uid,
          sourceCodeId: res.id
        });
        updateUrl(res, me.uid);
      })
      .catch((error: any) => {
        toggleProgressBarVisibility(false);
        onSetNotificationSettings(error.message, "danger", "long");
      });
  }

  function saveDeveloperCode() {
    const sourceCodeId = getSourceCodeIdFromUrl();
    if (sourceCodeId) {
      if (sourceCode === fetchedSourceCode) {
        onSetNotificationSettings("Your code is up to date", "info", "long");
        return;
      }
      updateSourcecode(sourceCodeId, { sourceCode });
    } else {
      const data = {
        sourceCode,
        readme: "",
        title: "Untitled",
        tags: []
      };
      saveNewSourcecode(data);
    }
  }

  function handleSaveSourceCode(value: string) {
    let me = Apis.users.getCurrentUser();
    if (!!me && me.email) {
      saveDeveloperCode();
    } else {
      handleOpenSignInModal();
    }
  }

  function handleSubmitComment(comment: string) {
    if (!currentUser) {
      handleOpenSignInModal();
    } else {
      setIsSubmittingComment(true);
      Apis.comments
        .createComment({
          data: {
            sourceCodeId,
            author: {
              id: currentUser.uid,
              name: currentUser.username,
              photoURL: currentUser.photoURL
            },
            text: comment,
            codeReference: selectionValue
          },
          params: {
            sourceCodeID: sourceCodeId
          }
        })
        .then(res => {
          setIsSubmittingComment(false);
          handleCloseInlineCodeComment();
          currentRightSection !== Constants.RIGHT_SECTION.comments &&
            changeCurrentRightSection();
        })
        .catch(err => {
          setIsSubmittingComment(false);
          onSetNotificationSettings(err, "danger", "long");
        });
    }
  }

  function handleCloseSignInModal() {
    setIsSignInModalVisible(false);
  }

  function handleOpenSignInModal() {
    setIsSignInModalVisible(true);
  }

  function resizeEditor(width: number) {
    if (monacoEditorContainerRef.current) {
      if (disableDragforward === true) return;
      setResizeWidth(width);
    }
  }

  return (
    <>
      <div
        ref={monacoEditorContainerRef}
        className={classes.monacoEditorContainer}
        style={{ width: resizeWidth }}
      >
        <ResizeListener
          resizeEditor={resizeEditor}
          currentBoundary={currentEditorBoundary}
          resizeWidth={
            monacoEditorContainerRef.current
              ? monacoEditorContainerRef.current.clientWidth
              : resizeWidth
          }
        />
        <SourceCodeHeading
          sourceCodeTitle={sourceCodeTitle}
          toggleProgressBarVisibility={toggleProgressBarVisibility}
          saveNewSourcecode={saveNewSourcecode}
          updateSourcecode={updateSourcecode}
          isFetchingSourceCodeMetaData={isFetchingSourceCodeMetaData}
          sourceCode={sourceCode}
          readme={readme}
          ownerId={ownerId}
        />
        <MonacoEditor
          ref={editorRef}
          onChangeValue={handleSourceCodeChange}
          onSaveValue={handleSaveSourceCode}
          onHighlightValue={handleCodeHighlight}
        />
        <InlineCodeComment
          visible={Boolean(commentAnchorDistanceY)}
          distanceY={commentAnchorDistanceY}
          onRequestClose={handleCloseInlineCodeComment}
          onOk={handleSubmitComment}
          loading={isSubmittingComment}
        />
      </div>
      <Fab
        color="primary"
        onClick={handleSourceCodeExecution}
        variant="round"
        classes={{ root: classes.monacoEditorRunButton }}
      >
        <PlayArrowIcon className={classes.monacoEditorRunButtonIcon} />
      </Fab>
      <SignInViaGithubHandler
        visible={isSignInModalVisible}
        onRequestClose={handleCloseSignInModal}
        onSignInSuccess={saveDeveloperCode}
      />
    </>
  );
};

const useStyles = makeStyles({
  monacoEditorContainer: {
    position: "relative",
    background: color.darkThemeBlack
    // transition: "all 0.5s"
  },
  monacoEditorRunButton: {
    position: "absolute",
    bottom: 15,
    right: "50%",
    zIndex: 2000
  },
  monacoEditorRunButtonIcon: {
    color: color.white,
    fontSize: fontsize.xlarge * 2,
    marginLeft: 2
  }
});

export default withNotificationBanner(Editor);
