/**
 * DTO for ILoginResponse
 */
export interface ILoginResponseDto {
  message: string;
  token: string;
}

/**
 * DTO for User Response
 */

export interface IUserDto {
  id: number;
  name: string;
  email: string;
}

/**
 * DTO for created user Response
 */

export interface ICreateUserResponseDto {
  message: string;
  result: IUserDto;
}
