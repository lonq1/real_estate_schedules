interface IAddressRequest {
    district: string;
    zipCode: string;
    number?: string;
    city: string;
    state: string;
}

interface IPropertyRequest {
    value: number;
    size: number;
    address: IAddressRequest;
    categoryId: string;
    sold?: boolean;
}

interface IPropertyResponse extends IPropertyRequest {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export { IAddressRequest, IPropertyRequest, IPropertyResponse };
