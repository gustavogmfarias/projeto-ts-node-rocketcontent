import { Category } from '@modules/cars/infra/typeorm/entities/category';

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

interface ICategoriesRepository {
  findByName(name: string): Promise<Category>;
  list(): Promise<Category[]>;
  create({ name, description }: ICreateCategoryDTO): Promise<void>;
  import({});
}

export { ICategoriesRepository, ICreateCategoryDTO };
