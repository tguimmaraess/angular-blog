export interface CommentInterface extends Array<CommentInterface> {
  _id: string;
  title: string;
  comment: string;
  name: string;
  date: Date;
  email: number;
};
