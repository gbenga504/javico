import React, { useContext } from 'react';

import ApiContext from './ApiContext';

const withApi = (Component: React.FC<any>) => (props: any) => {
  const Api = useContext(ApiContext);

  return <Component {...props} Api={Api} />;
};

export default withApi;
