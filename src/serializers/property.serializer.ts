import * as yup from "yup";
import { SchemaOf } from "yup";
import { IPropertyRequest } from "../interfaces/properties";

const createPropertySerializer: SchemaOf<IPropertyRequest> = yup
    .object()
    .shape({
        value: yup.number().required(),
        size: yup.number().required(),
        address: yup.object().shape({
            district: yup.string().required(),
            zipCode: yup.string().length(8).required(),
            number: yup.string(),
            city: yup.string().required(),
            state: yup.string().length(2).required(),
        }),
        categoryId: yup.string().uuid().required(),
        sold: yup.boolean(),
    });

export { createPropertySerializer };
