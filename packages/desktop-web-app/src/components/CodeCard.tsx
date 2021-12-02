import React from "react";
import { Typography, Box, Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { SyntaxHighlighter } from "@javico/common/lib/components";
import {
  parseTime,
  getRelativeTime,
  getReadableDate
} from "@javico/common/lib/utils";

interface IProps {
  sourceCode: string;
  photoURL?: string;
  author: string;
  title?: string;
  createdAt?: number;
  codeURL: string;
  authorURL: string;
}

const CodeCard: React.FC<IProps> = ({
  sourceCode,
  photoURL,
  author,
  title,
  createdAt,
  codeURL,
  authorURL
}) => {
  return (
    <Box>
      <SyntaxHighlighter
        containerStyle={{ height: 270, maxHeight: 270 }}
        sourceCode={sourceCode}
        startingLineNumber={1}
      />
      <Box pt={3} display="flex" style={{ color: "white" }}>
        <Avatar style={{ height: 30, width: 30 }} src={photoURL} />
        <Box ml={3} style={{ flex: 1 }}>
          <Link to={codeURL} style={{ color: "white" }}>
            <Typography variant="body1">{title}</Typography>
          </Link>
          <Typography variant="caption" style={{ color: "#bbb" }}>
            by{" "}
            <Link to={authorURL} style={{ color: "inherit" }}>
              {author}
            </Link>
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            style={{ flex: 1 }}
          >
            <Typography variant="caption" style={{ color: "#bbb" }}>
              {!!createdAt && getRelativeTime(createdAt)}
            </Typography>

            <Typography color="primary" variant="body2">
              12 comments
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(CodeCard);
