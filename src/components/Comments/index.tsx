import React from 'react';

import './index.css';
import { Typography, Icon } from '../../atoms';
import { comments, image } from '../../utils';

const Comments: React.FC = () => {
  return (
    <section className="comments">
      <div className="comments__body">
        {comments.map(el => {
          return (
            <div className="comment pl-16 pr-16" key={el._id}>
              <div className="pb-12 pt-12 flex-row">
                <img className="comment__user-image" src={`${image}`} alt={el.username} />
                <div className="pl-8">
                  <Typography className="comment__username mb-4" thickness="semi-bold" variant="p">
                    {el.username}{' '}
                    <Typography className="comment__time">yesterday at 4.38PM</Typography>
                  </Typography>
                  <Typography className="comment__user-comment" variant="p">
                    {el.comment}
                  </Typography>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="comment__input">
        <div className="comment__input-field-container flex-row ml-16 mr-16 mb-16">
          <input
            className="comment__input-field pl-16"
            type="text"
            placeholder="Add your review on gad's code"
          />
          <Icon className="comment__input-send-icon mr-8" name="send" />
        </div>
      </div>
    </section>
  );
};

export default Comments;
