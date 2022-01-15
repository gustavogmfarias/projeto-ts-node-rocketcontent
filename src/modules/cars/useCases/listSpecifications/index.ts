import { SpecificationsRepository } from '../../repositories/implementations/SpecificationsRepository';
import { ListSpecificationsController } from '././ListSpecificationsCotroller';
import { ListSpecificationsUseCase } from './listSpecificationsUseCase';

const specificationsRepository = new SpecificationsRepository();
const listSpecificationsUseCase = new ListSpecificationsUseCase(
  specificationsRepository,
);
const listSpecificationsController = new ListSpecificationsController(
  listSpecificationsUseCase,
);

export {
  specificationsRepository,
  listSpecificationsController,
  listSpecificationsUseCase,
};
