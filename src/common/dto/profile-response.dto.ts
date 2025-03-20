import { ApiResponse } from './api-response.dto';

export class ProfileResponse extends ApiResponse<any> {
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
