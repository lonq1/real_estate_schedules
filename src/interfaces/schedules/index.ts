interface IScheduleRequest {
    userId: string;
    propertyId: string;
    date: string;
    hour: string;
}

interface IScheduleSerializer {
    propertyId: string;
    date: string;
    hour: string;
}

export { IScheduleSerializer, IScheduleRequest };
