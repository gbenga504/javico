import { combineReducers } from 'redux';

import { SAVE_EDITOR_STATE } from './actionTypes';

const initialState = {
  model: null,
  viewState: null,
};

const editorStateReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SAVE_EDITOR_STATE:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  editorState: editorStateReducer,
});

export const getEditorState = (state: any) => state.editor.editorState;
