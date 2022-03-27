import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('Token missing');
  }

  //padrão token: bearer 156162sfafgd3
  const [, token] = authHeader.split(' '); //vai dividir o array da seguinte forma: [0] => bearer e [1] => 1516151650wdffwqfqw24. Dessa forma o [, token] ele vai pegar o segundo com a variavel token.

  try {
    const { sub: user_id } = verify(
      //o sub: user_id é só um alias
      token,
      '15c227979956878f68a08a8ce9623b48',
    ) as IPayload; //vai ter um retorno como IPayload

    const usersRepository = new UsersRepository();
    const user = usersRepository.findById(user_id);

    if (!user) {
      throw new Error("User doesn't exists");
    }
    next();
  } catch {
    throw new Error('Invalid Token');
  }
}
