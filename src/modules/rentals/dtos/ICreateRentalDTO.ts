interface ICreateRentalDTO {
  id?: string;
  user_id: string;
  car_id: string;
  expect_return_date: Date;
  end_date?: Date;
  total?: number;
}

export { ICreateRentalDTO };
