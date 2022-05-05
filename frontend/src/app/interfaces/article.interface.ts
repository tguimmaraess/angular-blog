export interface ArticleInterface extends Array<ArticleInterface> {
  _id: string;
  title: string;
  thumbnail: string;
  post: string;
  date: Date;
  likes: number;
  author: {
    _id: string;
    name: string;
    email: string;
  };
};
