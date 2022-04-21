import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateRentalUseCase } from './CreateRentalUseCase';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('CreateRental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );
  });

  it('should be able to create a new Rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'teste',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expect_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new Rental if the user has another one', async () => {
    expect(async () => {
      const rental1 = await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '1212',
        expect_return_date: dayAdd24Hours,
      });
      const rental2 = await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '1212',
        expect_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new Rental if the car has another one', async () => {
    expect(async () => {
      const rental1 = await createRentalUseCase.execute({
        user_id: '123',
        car_id: '1212',
        expect_return_date: dayAdd24Hours,
      });
      const rental2 = await createRentalUseCase.execute({
        user_id: '321',
        car_id: '1212',
        expect_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new Rental with invalid Return Time', async () => {
    expect(async () => {
      const rental1 = await createRentalUseCase.execute({
        user_id: '123',
        car_id: '1212',
        expect_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
