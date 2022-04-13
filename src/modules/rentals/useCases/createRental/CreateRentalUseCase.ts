import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  user_id: string;
  car_id: string;
  expect_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({
    user_id,
    car_id,
    expect_return_date,
  }: IRequest): Promise<Rental> {
    const minHour = 24;
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id,
    );
    if (carUnavailable) {
      throw new AppError('Car is unavailable');
    }

    const userOpenRental = await this.rentalsRepository.findOpenRentalByUser(
      user_id,
    );

    if (userOpenRental) {
      throw new AppError('There is a rental in progress for user! ');
    }

    const dateNow = this.dateProvider.dateNow();

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expect_return_date,
    );

    if (compare < minHour) {
      throw new AppError('Invalid Return Time');
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expect_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
