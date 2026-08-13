import { registerEnumType } from "@nestjs/graphql";

export enum AnimalStatus {
    AVAILABLE = 'AVAILABLE',
    ADOPTED = 'ADOPTED',
}

registerEnumType(AnimalStatus, {
    name: 'AnimalStatus',
    description: 'Status of the Animal.',
});