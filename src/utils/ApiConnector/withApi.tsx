import React from 'react';

import ApiContext from './ApiContext';

const withApi = (Component: React.FC<any>) => (props: any) => (
  <ApiContext.Consumer>{Api => <Component {...props} Api={Api} />}</ApiContext.Consumer>
);

export default withApi;
