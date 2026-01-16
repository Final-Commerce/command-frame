import { BaseEntity } from "./base-entity";

export type CustomExtension = BaseEntity & {
    _id: string;
    label: string;
    description?: string;
    backgroundUrl?: string;
    gallery?: string[];
    category: string;
    short_description?: string;
    long_description?: string;
    main_image?: string;
    price: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    website?: string;
};
