import React from 'react';

import MonacoEditor from './MonacoEditor';

const Editor: React.FC<{}> = () => {
  return (
    <div style={{ height: '100%' }}>
      <MonacoEditor />
    </div>
  );
};

export default Editor;
