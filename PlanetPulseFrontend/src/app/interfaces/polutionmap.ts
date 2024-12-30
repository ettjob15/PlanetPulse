export interface PolutionMapHistory {
    dateValue: Date;
    city: string;
    coValue: number;
    nh3Value: number;
    no2Value: number;
    o3Value: number;
    pm10Value: number;
    pm25Value: number;
    polutionIndex: number;
    so2Value: number;
}

export interface Page<T> {
    data: T[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
  }