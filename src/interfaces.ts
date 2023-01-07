export type User = {
    id: number;
    bodyParameters: BodyParameters;
    name: string;
}

type BodyParameters = {
    fat: string[],
    weight: string[],
    labels: string[],
}