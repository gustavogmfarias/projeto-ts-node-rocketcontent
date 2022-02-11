import fs from 'fs';
import { parse } from 'csv-parse';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IImportCategory {
  name: string;
  description: string;
}

class ImportCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const categories: IImportCategory[] = [];
      const stream = fs.createReadStream(file.path);
      const parseFile = parse(); //diz que vamos usar csv separado por virgula
      stream.pipe(parseFile);
      parseFile
        .on('data', async line => {
          const [name, description] = line;
          categories.push({ name, description });
        })
        .on('end', () => {
          fs.promises.unlink(file.path); //remove o arquivo que subimos;
          resolve(categories);
        })
        .on('error', err => reject(err));
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.map(async category => {
      const { name, description } = category;
      const existCategory = this.categoriesRepository.findByName(name);
      if (!existCategory) {
        this.categoriesRepository.create({ name, description });
      }

      return;
    });
  }
}

export { ImportCategoryUseCase };
