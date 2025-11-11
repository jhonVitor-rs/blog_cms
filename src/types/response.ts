export type Response<T = unknown> = {
  success: boolean;
  message: string;
  data?: T
}
