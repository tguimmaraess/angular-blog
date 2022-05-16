export interface PanelInterface {
  countComments: {
    totalComments: number;
  }[];
  countPosts: {
    totalPosts: number
  }[]
  countLikes: {
    totalLikes: number;
  }[];
  getArticleWithMostVisits: {
    _id: string;
    title: string;
    visitsMax: number;
  }[];
  getArticleWithLeastVisits: {
    _id: string;
    title: string;
    visitsMin: number;
  }[];
}
