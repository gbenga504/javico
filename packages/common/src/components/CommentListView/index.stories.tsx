import React from "react";
import { CommentList, Comment } from ".";
import { MuiThemeProvider } from "@material-ui/core";

import { theme } from "../../design-language/Css";

export default {
  title: "CommentList",
  decorators: [
    storyFn => (
      <MuiThemeProvider theme={theme}>
        <div style={{ width: "100%", height: "100vh" }}>{storyFn()}</div>
      </MuiThemeProvider>
    )
  ]
};

export const withShim = () => (
  <CommentList
    visible={true}
    loading={true}
    onTopReached={() => console.log("top reached")}
    onTopReachedThreshold={0.8}
    data={[
      {
        sourceCodeId: "1",
        author: {
          id: "1",
          name: "Anifowoshe Gbenga",
          photoURL: ""
        },
        text: "I love my life",
        id: "1",
        createdAt: Date.now(),
        numReplies: 2,
        clientTimestamp: Date.now()
      }
    ]}
    onSend={(comment, type) =>
      console.log("Comment is", comment, "and the type is", type)
    }
    renderItem={item => (
      <Comment
        text={item.text}
        id={item.id}
        authorName={item.author.name}
        authorPhotoURL={item.author.photoURL}
        createdAt={item.createdAt}
        userId="1"
        authorId={item.id}
        onRequestDelete={id => console.log("Delete was requested with", id)}
        onEdit={(id, prevComment, currentComment) =>
          console.log(
            "The id",
            id,
            "prev comment",
            prevComment,
            "current comment",
            currentComment
          )
        }
        isEditing={false}
        repliesProps={{
          numReplies: item.numReplies,
          data: [
            {
              commentId: "1",
              author: {
                id: "2",
                name: "Labelu Tobi",
                photoURL: ""
              },
              text: "This code looks good",
              id: "1",
              createdAt: Date.now()
            }
          ],
          loading: false,
          onLoadMore: nextCursor => console.log("next cursor", nextCursor),
          onRequestDelete: id => console.log("request to delete reply", id),
          onEdit: (id, prevReply, currentReplyText) =>
            console.log(
              "id for reply",
              id,
              "previous reply",
              prevReply,
              "current reply",
              currentReplyText
            ),
          isEditing: { "1": false }
        }}
      />
    )}
  />
);
