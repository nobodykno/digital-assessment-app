

/**
 * all required models for auth
 */
export interface ILoginRequestDto {
    email: string;
    password: string;
}

export interface IRegisterRequestDto {
    name: string;
    password: string;
    email: string;
}


export interface ILoginResponseDto {
 token: string;
 message: string;
}


export interface IRegisterResponseDto {
 message: string;
 result:{
    id: number,
    email: string,
    name: string
 }
}



