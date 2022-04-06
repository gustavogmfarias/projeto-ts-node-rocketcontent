import { inject, injectable } from 'tsyringe';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { AppError } from '@shared/errors/AppError';

@injectable()
class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}
  async execute({
    name,
    description,
    daily_rate,
    license_plate,
    category_id,
    brand,
    fine_amount,
  }: ICreateCarDTO): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(
      license_plate,
    );

    if (carAlreadyExists) {
      throw new AppError('Car already exists');
    }

    const car = await this.carsRepository.create({
      name,
      description,
      daily_rate,
      license_plate,
      category_id,
      brand,
      fine_amount,
    });

    return car;
  }
}

export { CreateCarUseCase };
