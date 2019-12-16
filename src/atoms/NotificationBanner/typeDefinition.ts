export type IBannerStyle = 'success' | 'warning' | 'danger' | 'info';
export type IDuration = 'long' | 'short' | number;
export interface INotificationBannerProps {
  text: string;
  style?: IBannerStyle;
  id: number;
  duration: IDuration;
}
