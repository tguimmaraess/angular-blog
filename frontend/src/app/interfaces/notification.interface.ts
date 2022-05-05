export interface NotificationInterface extends Array<NotificationInterface> {
  title: string;
  message: string;
  date: Date;
}[];
