export type ApiResponse<T = unknown> = {
  data: T;
  status: number;
  message: "OK" | "ERROR" | string;
  error?: T;
};
