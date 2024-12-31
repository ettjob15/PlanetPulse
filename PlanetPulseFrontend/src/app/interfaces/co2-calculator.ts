export interface Co2Calculator {
    fromCity: string;
    toCity: string;
    distance: number;
    distanceMode: DistanceMode;
    co2: number;
    //date: Date;

}
export interface DistanceMode{
    name: string;
}