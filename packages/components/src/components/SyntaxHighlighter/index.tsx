import React from "react";
import { Light as ReactSyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import vs2015 from "react-syntax-highlighter/dist/esm/styles/hljs/vs2015";

import { useStyles } from "./styles";

interface IProps {
  containerStyle?: any;
  sourceCode: string;
}

ReactSyntaxHighlighter.registerLanguage("javascript", js);
const SyntaxHighlighter: React.FC<IProps> = ({
  containerStyle,
  sourceCode
}) => {
  const classes = useStyles();

  return (
    <ReactSyntaxHighlighter
      className={classes.codeContainer}
      style={vs2015}
      showLineNumbers={true}
      customStyle={{ margin: 0, padding: 0, ...containerStyle }}
      lineNumberContainerProps={{ className: classes.lineNumbersContainer }}
    >
      {sourceCode}
    </ReactSyntaxHighlighter>
  );
};

export default SyntaxHighlighter;
