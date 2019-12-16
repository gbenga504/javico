import React from 'react';

import './index.css';
import { Typography, Icon } from '../../atoms';
import { image } from './comments_dummy';

const Comments: React.FC<{ comments: any[] }> = ({ comments }) => {
  function renderComments() {
    return comments.map(el => {
      return (
        <div className="comment pl-16 pr-16" key={el._id}>
          <div className="pb-12 pt-12 flex-row">
            <img className="comment__user-image" src={`${image}`} alt={el.username} />
            <div className="pl-8">
              <Typography className="comment__username mb-4" thickness="semi-bold" variant="p">
                {el.username} <Typography className="comment__time">yesterday at 4.38PM</Typography>
              </Typography>
              <Typography className="comment__user-comment" variant="p">
                {el.comment}
              </Typography>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <section className="comments">
      <div className="full-height-and-width comments__body">
        {process.env.REACT_APP_IS_COMMENT_FEATURE_AVAILABLE === 'true' ? (
          renderComments()
        ) : (
          <div className="flex-row center full-height-and-width" style={{ cursor: 'not-allowed' }}>
            <Typography variant="div" thickness="bold" className="comment__not-live">
              COMMENTS NOT LIVE
            </Typography>
          </div>
        )}
      </div>
      <div className="comment__input">
        <div className="comment__input-field-container flex-row ml-16 mr-16 mb-16">
          <input
            className="comment__input-field pl-16"
            type="text"
            placeholder="Drop a review on this code"
          />
          <Icon
            className="comment__input-send-icon mr-8"
            name="send"
            style={{
              cursor:
                process.env.REACT_APP_IS_COMMENT_FEATURE_AVAILABLE === 'true'
                  ? 'pointer'
                  : 'not-allowed',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Comments;
