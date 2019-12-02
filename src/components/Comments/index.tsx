import React from 'react';

import './index.css';
import { Typography, Icon } from '../../atoms';
import { comments, image } from '../../utils';

const Comments: React.FC = () => {
  return (
    <section className="comments">
      <div className="comments--body">
        {comments.map(el => {
          return (
            <div className="comment pl-16 pr-16" key={el._id}>
              <div className="pb-8 pt-8 flex-row">
                <img className="comment--user-image" src={`${image}`} alt={el.username} />
                <div className="pl-8">
                  <Typography className="comment--username mb-4" thickness="semi-bold" variant="p">
                    {el.username}{' '}
                    <Typography className="comment--time">yesterday at 4.38PM</Typography>
                  </Typography>
                  <Typography className="comment--user-comment" variant="p">
                    {el.comment}
                  </Typography>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="comment--input">
        <div className="comment--input-wrapper flex-column center">
          <div className="comment--input-field-container flex-row">
            <input
              className="comment--input-field pl-16"
              type="text"
              placeholder="Add your review on gad's code"
            />
            <Icon className="comment--input-send-icon mr-16" name="send" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comments;
