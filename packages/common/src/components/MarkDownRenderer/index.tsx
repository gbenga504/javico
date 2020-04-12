import React from "react";
import ReactMarkDown from "react-markdown";
import { makeStyles } from "@material-ui/core";

import { color } from "../../design-language/Css";

interface IProps {
  source: string;
  linkTarget?: string;
}

interface IMarkDownLink {
  target: string;
  href: string;
  children: React.ReactNode;
}

interface IMarkDownBlockQuote {
  children: React.ReactNode;
}

interface IMarkDownCode {
  children?: React.ReactNode;
  value?: string;
}

const useStyles = makeStyles(theme => ({
  markdownLink: {
    color: `${color.themeBlueDarker} !important`
  },
  markdownBlockquote: {
    borderLeft: `5px solid ${color.themeBlue}`,
    background: color.gray20,
    color: color.black,
    padding: theme.spacing(2, 3)
  },
  markdownCode: {
    background: color.gray20,
    color: color.black,
    padding: theme.spacing(1)
  }
}));

const MarkDownRenderer: React.FC<IProps> = ({
  source,
  linkTarget = "_blank"
}) => {
  const classes = useStyles();

  function customRenderers() {
    return {
      link: ({ target, href, children }: IMarkDownLink) => (
        <a href={href} target={target} className={classes.markdownLink}>
          {children}
        </a>
      ),
      blockquote: ({ children }: IMarkDownBlockQuote) => (
        <blockquote className={classes.markdownBlockquote}>
          {children}
        </blockquote>
      ),
      inlineCode: ({ children }: IMarkDownCode) => (
        <code className={classes.markdownCode}>{children}</code>
      ),
      code: ({ value }: IMarkDownCode) => (
        <pre className={classes.markdownCode}>
          <code>{value}</code>
        </pre>
      )
    };
  }

  return (
    <ReactMarkDown
      source={source}
      linkTarget={linkTarget}
      renderers={customRenderers()}
    />
  );
};

export default React.memo(MarkDownRenderer);
