import * as yup from "yup";
import { SchemaOf } from "yup";
import { IScheduleSerializer } from "../interfaces/schedules";

const createScheduleSerializer: SchemaOf<IScheduleSerializer> = yup
    .object()
    .shape({
        propertyId: yup.string().uuid().required(),
        date: yup.string().max(10).required(),
        hour: yup.string().max(5).required(),
    });

export { createScheduleSerializer };
