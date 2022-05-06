import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe('Send forgot e-mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });
  it('should be able to send a forgot password e-mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      driver_license: '443901',
      email: 'laiji@giwafgo.mk',
      name: 'Mae Zimmerman',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('laiji@giwafgo.mk');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to sen a email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('menitbon@loklosas.ca'),
    ).rejects.toEqual(new AppError("User doesn't exists"));
  });

  it('should be able to create an usersToken', async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      'create',
    );

    await usersRepositoryInMemory.create({
      driver_license: '23160',
      email: 'laijsdsdi@giwafgo.mk',
      name: 'Mae Zimmerman',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('laijsdsdi@giwafgo.mk');

    expect(generateTokenMail).toBeCalled();
  });
});
