import AppDataSource from "../../data-source";
import { Addresses } from "../../entities/addresses";
import { Categories } from "../../entities/categories";
import { Properties } from "../../entities/properties";
import { AppError } from "../../errorGlobal/AppError";
import { IPropertyRequest } from "../../interfaces/properties";

export async function createPropertyService(
    payload: IPropertyRequest
): Promise<object> {
    const { zipCode, number, city } = payload.address;
    const { address, categoryId, ...propertyInfo } = payload;

    const categoryRepo = AppDataSource.getRepository(Categories);
    const category = await categoryRepo.findOneBy({ id: categoryId });

    if (!category) {
        throw new AppError(404, "Category doesn't exist.");
    }

    const adressRepo = AppDataSource.getRepository(Addresses);

    const checkAddressExists = await adressRepo.findOneBy({
        zipCode,
        number,
        city,
    });

    if (checkAddressExists) {
        throw new AppError(409, "Address already exists.");
    }

    const newAddress = adressRepo.create(address);
    await adressRepo.save(newAddress);

    const propertyRepo = AppDataSource.getRepository(Properties);
    const newProperty = propertyRepo.create(propertyInfo);

    newProperty.address = newAddress;
    newProperty.category = category;
    await propertyRepo.save(newProperty);

    return newProperty;
}
