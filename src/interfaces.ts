export type User = {
    id: number;
    bodyParameters: BodyParameters;
    name: string;
    gender: string,
}

type ReportData = {
    fat: number,
    weight: number,
    minWeight: number,
    reportNumber: number,
    date: string,
    neck: number, 
    waist: number, 
    hip: number
}

type BodyParameters = {
    fat: string[],
    weight: string[],
    labels: string[],
    reportData: ReportData[],
}