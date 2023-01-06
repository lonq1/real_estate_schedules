import * as yup from "yup";
import { SchemaOf } from "yup";
import { IUserRequest, IUserUpdate } from "../interfaces/users";

const createUserSerializer: SchemaOf<IUserRequest> = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    name: yup.string().required(),
    isAdm: yup.bool().required(),
});

const updateUserSerializer: SchemaOf<IUserUpdate> = yup.object().shape({
    email: yup.string().email(),
    password: yup.string(),
    name: yup.string(),
});

export { updateUserSerializer, createUserSerializer };
