import { combineReducers } from 'redux';
import editorReducer from './editor/reducers';

export default combineReducers({
  editor: editorReducer,
});
