import { IUserLogin, IUserRequest, IUserUpdate } from "../../interfaces/users";
import { IScheduleRequest } from "../../interfaces/schedules";
import { IPropertyRequest } from "../../interfaces/properties";
import { ICategoryRequest } from "../../interfaces/categories";

const mockedUser: IUserRequest = {
    name: "Joana",
    email: "joana@mail.com",
    isAdm: false,
    password: "123456",
};

const mockedAdmin: IUserRequest = {
    name: "Felipe",
    email: "felipe@mail.com",
    isAdm: true,
    password: "123456",
};

const mockedUserLogin: IUserLogin = {
    email: "joana@mail.com",
    password: "123456",
};

const mockedAdminLogin: IUserLogin = {
    email: "felipe@mail.com",
    password: "123456",
};

const mockedUpdateUser: IUserUpdate = {
    name: "novo nome",
    email: "novo@email.com",
};

const mockedCategory: ICategoryRequest = {
    name: "Apartamento",
};

const mockedProperty: IPropertyRequest = {
    size: 350,
    value: 10000000,
    address: {
        district: "Rua Heleodo Pires de camargo",
        zipCode: "18150000",
        number: "67",
        city: "Piedade",
        state: "SP",
    },
    categoryId: "",
};

const mockedProperty2: IPropertyRequest = {
    size: 350,
    value: 10000000,
    address: {
        district: "Rodovia Bunjiro Nakao",
        zipCode: "18170000",
        number: "42",
        city: "Ibiúna",
        state: "SP",
    },
    categoryId: "",
};

const mockedPropertyInvalidZipCode: IPropertyRequest = {
    size: 350,
    value: 10000000,
    address: {
        district: "Rua Heleodo Pires de camargo",
        zipCode: "1815000033",
        number: "67",
        city: "Piedade",
        state: "SP",
    },
    categoryId: "",
};

const mockedPropertyInvalidState: IPropertyRequest = {
    size: 350,
    value: 10000000,
    address: {
        district: "Rua Heleodo Pires de camargo",
        zipCode: "18150000",
        number: "67",
        city: "Piedade",
        state: "SPGO",
    },
    categoryId: "",
};

const mockedPropertyInvalidCategoryId: IPropertyRequest = {
    size: 350,
    value: 10000000,
    address: {
        district: "Rua Heleodo Pires de camargo",
        zipCode: "18150000",
        number: "68",
        city: "Piedade",
        state: "SP",
    },
    categoryId: "8f9ae6ce-e36c-4d9d-9bd7-b4c98cb4e4f4",
};

const mockedSchedule: IScheduleRequest = {
    date: "2022/08/12",
    hour: "10:30",
    propertyId: "",
    userId: "",
};

const mockedScheduleInvalidPropertyId: IScheduleRequest = {
    date: "2022/08/12",
    hour: "10:30",
    propertyId: "b855d86b-d4c9-41cd-ab98-d7fa734c6ce4",
    userId: "",
};

const mockedScheduleInvalidDate: IScheduleRequest = {
    date: "2022/08/20",
    hour: "10:30",
    propertyId: "",
    userId: "",
};

const mockedScheduleInvalidHourLess8: IScheduleRequest = {
    date: "2022/08/17",
    hour: "5:30",
    propertyId: "",
    userId: "",
};

const mockedScheduleInvalidHourMore18: IScheduleRequest = {
    date: "2022/08/17",
    hour: "18:30",
    propertyId: "",
    userId: "",
};

const mockedInvalidId: string = "13970660-5dbe-423a-9a9d-5c23b37943cf";

export {
    ICategoryRequest,
    IPropertyRequest,
    IScheduleRequest,
    IUserLogin,
    IUserRequest,
    mockedAdmin,
    mockedAdminLogin,
    mockedCategory,
    mockedInvalidId,
    mockedProperty,
    mockedProperty2,
    mockedPropertyInvalidCategoryId,
    mockedPropertyInvalidState,
    mockedPropertyInvalidZipCode,
    mockedSchedule,
    mockedScheduleInvalidDate,
    mockedScheduleInvalidHourLess8,
    mockedScheduleInvalidHourMore18,
    mockedScheduleInvalidPropertyId,
    mockedUser,
    mockedUserLogin,
    mockedUpdateUser,
};
