import React from 'react';

import MonacoEditor from '../../components/MonacoEditor';

const Home: React.FC = () => {
  return (
    <div className="flex-row" style={{ height: '100%' }}>
      <MonacoEditor onChangeValue={value => console.log(value)} />
    </div>
  );
};

export default Home;
