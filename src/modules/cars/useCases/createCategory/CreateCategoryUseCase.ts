import { inject, injectable } from 'tsyringe';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';
import { CategoriesRepository } from '../../repositories/implementations/CategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject(CategoriesRepository)
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ description, name }: IRequest): Promise<void> {
    const CategoryAlreadyExists = await this.categoriesRepository.findByName(
      name,
    );

    if (CategoryAlreadyExists) {
      throw new Error('Category Already exists');
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
