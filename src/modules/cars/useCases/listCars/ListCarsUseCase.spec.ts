import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { ListCarsUseCase } from './ListCarsUseCase';

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 1',
      description: 'carro feio',
      daily_rate: 24.0,
      license_plate: 'ABDC-1234',
      category_id: 'category_id',
      brand: 'volks',
      fine_amount: 100,
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 2',
      description: 'carro feio',
      daily_rate: 24.0,
      license_plate: 'ABDC-12345',
      category_id: 'category_id',
      brand: 'volks',
      fine_amount: 100,
    });

    const cars = await listCarsUseCase.execute({ name: 'Car 2' });
    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 3',
      description: 'carro feio',
      daily_rate: 24.0,
      license_plate: 'ABDC-123456',
      category_id: 'category_id',
      brand: 'volks',
      fine_amount: 100,
    });

    const cars = await listCarsUseCase.execute({ brand: 'volks' });
    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category_id', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 4',
      description: 'carro feio',
      daily_rate: 24.0,
      license_plate: 'ABDC-1234567',
      category_id: 'category_id4',
      brand: 'volks',
      fine_amount: 100,
    });

    const cars = await listCarsUseCase.execute({ category_id: 'category_id4' });
    expect(cars).toEqual([car]);
  });
});
