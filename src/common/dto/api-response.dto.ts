export class CustomApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;

  constructor(data: T, message = 'Success', statusCode = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
