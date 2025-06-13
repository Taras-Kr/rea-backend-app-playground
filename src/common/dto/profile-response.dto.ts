import { CustomApiResponse } from './api-response.dto';

export class ProfileResponse extends CustomApiResponse<any> {
  isAuthenticated: boolean;

  constructor(
    data: any,
    isAuthenticated: boolean,
    message: string,
    statusCode: number,
  ) {
    super(data, message, statusCode);
    this.isAuthenticated = isAuthenticated;
  }
}
