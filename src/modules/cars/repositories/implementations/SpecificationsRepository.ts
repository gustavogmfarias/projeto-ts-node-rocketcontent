import { Specification } from '../../model/Specification';
import {
  ISpecificationsRepository,
  ICreateSpecificationDTO,
} from '../ISpecificationsRepository';

class SpecificationsRepository implements ISpecificationsRepository {
  private specifications: Specification[];

  public static INSTANCE: SpecificationsRepository;

  constructor() {
    this.specifications = [];
  }
  list(): Specification[] {
    return this.specifications;
  }

  public static getInstance(): SpecificationsRepository {
    if (!SpecificationsRepository.INSTANCE)
      SpecificationsRepository.INSTANCE = new SpecificationsRepository();

    return SpecificationsRepository.INSTANCE;
  }

  create({ description, name }: ICreateSpecificationDTO): void {
    const specification = new Specification();
    Object.assign(specification, { description, name, created_at: new Date() });
    this.specifications.push(specification);
  }

  findByName(name: string): Specification {
    const specification = this.specifications.find(
      specification => specification.name === name,
    );
    return specification;
  }
}

export { SpecificationsRepository };
