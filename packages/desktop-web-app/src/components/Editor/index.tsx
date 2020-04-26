import React, { useEffect, useState, useRef } from "react";
import { Fab } from "@material-ui/core";
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

import { useStyles } from "./styles";
import SourceCodeHeading from "./SourceCodeHeading";
import SignInViaGithubHandler from "../SignInViaGithubHandler";
import * as Constants from "../../utils/Constants";
import { getCurrentUserState } from "../../redux/auth/reducers";

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
  const [sourceCode, setSourceCode] = useState<string>("");
  const editorRef = useRef<any>(null);
  const classes = useStyles();
  const {
    sourceCode: fetchedSourceCode,
    ownerId,
    title: sourceCodeTitle,
    sourceCodeId,
    readme
  } = sourceCodeMetaData || {};

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

  return (
    <>
      <div className={classes.monacoEditorContainer}>
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

export default React.memo(withNotificationBanner(Editor));
