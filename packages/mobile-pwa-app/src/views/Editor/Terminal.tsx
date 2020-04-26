import React from 'react';

import DragableWrapper from '../../components/DragableWrapper';

const Terminal: React.FC<{
  isVisible: boolean;
  hideComponent: () => void;
}> = ({ isVisible, hideComponent }) => {
  return (
    <DragableWrapper isVisible={isVisible} hideComponent={hideComponent}>
      <div>Terminal</div>
    </DragableWrapper>
  );
};

export default Terminal;
