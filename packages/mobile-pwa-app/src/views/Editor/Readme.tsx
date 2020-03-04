import React from 'react';

import DragableWrapper from '../../components/DragableWrapper';

const Readme: React.FC<{
  isVisible: boolean;
  hideComponent: () => void;
}> = ({ isVisible, hideComponent }) => {
  return (
    <DragableWrapper isVisible={isVisible} hideComponent={hideComponent}>
      <div>Readme</div>
    </DragableWrapper>
  );
};

export default Readme;
