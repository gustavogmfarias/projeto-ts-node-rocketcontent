import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
describe('CreateCar', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('shoud be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'name car',
      description: 'description car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      category_id: 'category',
      brand: 'brand',
      fine_amount: 10,
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be to create a new car with exists same license plate', () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: 'Car 1',
        description: 'description car',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        category_id: 'category',
        brand: 'brand',
        fine_amount: 10,
      });

      await createCarUseCase.execute({
        name: 'Car 2',
        description: 'description car',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        category_id: 'category',
        brand: 'brand',
        fine_amount: 10,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be to create a new car with available true as default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car Available',
      description: 'description car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      category_id: 'category',
      brand: 'brand',
      fine_amount: 10,
    });
    expect(car.available).toBe(true);
  });
});
