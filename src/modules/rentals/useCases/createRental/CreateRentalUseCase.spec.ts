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
      name: 'test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'test',
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
    const carbr = await carsRepositoryInMemory.create({
      name: 'test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'testbr',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    await rentalsRepositoryInMemory.create({
      car_id: carbr.id,
      user_id: '12345',
      expect_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: carbr.id,
        user_id: '12345',
        expect_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError('There is a rental in progress for user!'));
  });

  it('should not be able to create a new Rental if the car has another one', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    const rental1 = await createRentalUseCase.execute({
      user_id: '123',
      car_id: car.id,
      expect_return_date: dayAdd24Hours,
    });
    await expect(
      createRentalUseCase.execute({
        user_id: '321',
        car_id: car.id,
        expect_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError('Car is unavailable'));
  });

  it('should not be able to create a new Rental with invalid Return Time', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: '123',
        car_id: '1212',
        expect_return_date: dayjs().toDate(),
      }),
    ).rejects.toEqual(new AppError('Invalid Return Time'));
  });
});
