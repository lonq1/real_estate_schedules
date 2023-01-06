import AppDataSource from "../../data-source";
import { Addresses, Categories, Properties } from "../../entities/imports";
import { AppError } from "../../errorGlobal/AppError";
import {
    IPropertyRequest,
    IPropertyResponse,
} from "../../interfaces/properties";

export async function createPropertyService(
    payload: IPropertyRequest
): Promise<IPropertyResponse> {
    const { zipCode, number, city, district, state } = payload.address;
    const { address, categoryId, ...propertyInfo } = payload;

    const categoryRepo = AppDataSource.getRepository(Categories);
    const category = await categoryRepo.findOneBy({ id: categoryId });

    if (!category) throw new AppError(404, "Category doesn't exist.");

    const adressRepo = AppDataSource.getRepository(Addresses);
    const checkAddressExists = await adressRepo.findOneBy({
        zipCode,
        number,
        city,
        district,
        state,
    });

    if (checkAddressExists) throw new AppError(409, "Address already exists.");

    const newAddress = adressRepo.create(address);
    await adressRepo.save(newAddress);

    const propertyRepo = AppDataSource.getRepository(Properties);
    const newProperty = propertyRepo.create(propertyInfo);

    newProperty.address = newAddress;
    newProperty.category = category;
    await propertyRepo.save(newProperty);

    return newProperty;
}
