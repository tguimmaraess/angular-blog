export interface UserInterface {
  _id: number;
  email: string;
  name: string;
  settings: {
    notificationSound: string;
    theme: string;
  }
  jsonwebtoken: string;
};
