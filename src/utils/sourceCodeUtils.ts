import SourceCodeService from '../services/SourceCodeServices';
import { IBannerStyle, IDuration } from '../atoms/NotificationBanner';

interface IPayload {
  me?: any;
  sourceCode: string;
  toggleIsLoading: any;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
  id: string;
  editorRef?: any;
  setSourceCode?: any;
}

function updateUrl(res: any) {
  const location = window.location.href;
  const href = `${location}${res.id}`;
  var base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);

  //Change to new page with hash
  var newPage = window.location.href + '#' + href.replace(base, '');
  window.location.href = newPage;

  //Remove hash from URL and replace with desired URL
  if (window.history && window.history.pushState) {
    //Only do this if history.pushState is supported by the browser
    window.history.pushState({}, '', href);
  }
}

export const updateSourcecode = ({
  me,
  id,
  sourceCode,
  toggleIsLoading,
  onSetNotificationSettings,
}: IPayload) => {
  SourceCodeService.saveSourceCode({
    data: {
      ownerId: me.uid,
      sourceCode,
      readme: '',
      title: 'test.js',
      tags: [],
    },
    params: {
      ID: id,
    },
  })
    .then((res: any) => {
      toggleIsLoading();
      console.log('response ', res);
    })
    .catch((error: any) => {
      toggleIsLoading();
      onSetNotificationSettings(error.message, 'danger', 'long');
    });
};

export const addNewSourcecode = ({
  me,
  sourceCode,
  toggleIsLoading,
  onSetNotificationSettings,
}: IPayload) => {
  SourceCodeService.saveSourceCode({
    data: {
      ownerId: me.uid,
      sourceCode,
      readme: '',
      title: 'test.js',
      tags: [],
    },
  })
    .then(res => {
      toggleIsLoading();
      updateUrl(res);
    })
    .catch((error: any) => {
      toggleIsLoading();
      onSetNotificationSettings(error.message, 'danger', 'long');
    });
};

export const getSourceCode = ({
  id,
  toggleIsLoading,
  editorRef,
  setSourceCode,
  onSetNotificationSettings,
}: IPayload) => {
  toggleIsLoading(true);
  SourceCodeService.fetchSourceCode({
    params: { ID: id },
  })
    .then(res => {
      const { sourceCode, readme, tags, ownerId, title, createdAt } = res._document.proto.fields;
      toggleIsLoading();
      setSourceCode(sourceCode.stringValue);
      editorRef.current.getModel().setValue(sourceCode.stringValue);
    })
    .catch((error: any) => {
      toggleIsLoading();
      onSetNotificationSettings(error.message, 'danger', 'long');
    });
};
