import React from 'react';

import DragableWrapper from '../../components/DragableWrapper';

const Readme: React.FC<{
  isScrollUp: boolean;
  isVisible: boolean;
  hideComponent: () => void;
}> = ({ isVisible, isScrollUp, hideComponent }) => {
  return (
    <DragableWrapper isScrollUp={isScrollUp} isVisible={isVisible} hideComponent={hideComponent}>
      <div>Readme</div>
    </DragableWrapper>
  );
};

export default Readme;
