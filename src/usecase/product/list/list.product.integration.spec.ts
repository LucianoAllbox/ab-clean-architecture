import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

describe("Test list products use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list products", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product1 = new Product("123", "Car", 1);
    const product2 = new Product("456", "Jet", 2);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const output = 
    {
      "products" : [
      {
        id: "123",
        name: "Car",
        price: 1
      },
      {
        id: "456",
        name: "Jet",
        price: 2
      }]
    };

    const result = await usecase.execute(null);

    expect(result).toEqual(output);
  });
});
