export const RIGHT_SECTION = {
  comments: "comments",
  console: "console"
};

export interface ISourceCodeMetaData {
  sourceCode: string;
  readme?: string;
  ownerId: string;
  title?: string;
  sourceCodeId: string;
}
