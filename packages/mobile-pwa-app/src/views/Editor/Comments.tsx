import React from 'react';

import DragableWrapper from '../../components/DragableWrapper';

const Comments: React.FC<{
  isVisible: boolean;
  hideComponent: () => void;
}> = ({ isVisible, hideComponent }) => {
  return (
    <DragableWrapper isVisible={isVisible} hideComponent={hideComponent}>
      <div>Comments</div>
    </DragableWrapper>
  );
};

export default Comments;
