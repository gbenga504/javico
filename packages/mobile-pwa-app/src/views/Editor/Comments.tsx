import React from 'react';

import DragableWrapper from '../../components/DragableWrapper';

const Comments: React.FC<{
  isScrollUp: boolean;
  isVisible: boolean;
  hideComponent: () => void;
}> = ({ isVisible, isScrollUp, hideComponent }) => {
  return (
    <DragableWrapper isScrollUp={isScrollUp} isVisible={isVisible} hideComponent={hideComponent}>
      <div>Comments</div>
    </DragableWrapper>
  );
};

export default Comments;
