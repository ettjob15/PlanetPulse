import { TransportMode } from "./transport-mode";

interface TransportModeDetails {
    id: number;
    emissionFactor: number;
  }
  
export const TransportModeDetails: { [key in TransportMode]: TransportModeDetails } = {
    [TransportMode.DomesticFlight]: { id: 39, emissionFactor: 0.246 },
    [TransportMode.DieselCar]: { id: 40, emissionFactor: 0.171 },
    [TransportMode.PetrolCar]: { id: 41, emissionFactor: 0.170 },
    [TransportMode.ShortHaulFlight]: { id: 42, emissionFactor: 0.151 },
    [TransportMode.LongHaulFlight]: { id: 43, emissionFactor: 0.148 },
    [TransportMode.Motorbike]: { id: 44, emissionFactor: 0.114 },
    [TransportMode.Bus]: { id: 45, emissionFactor: 0.097 },
    [TransportMode.BusCity]: { id: 46, emissionFactor: 0.079 },
    [TransportMode.PlugInHybrid]: { id: 47, emissionFactor: 0.068 },
    [TransportMode.ElectricCar]: { id: 48, emissionFactor: 0.047 },
    [TransportMode.NationalRail]: { id: 49, emissionFactor: 0.035 },
    [TransportMode.Tram]: { id: 50, emissionFactor: 0.0029 },
    [TransportMode.Underground]: { id: 51, emissionFactor: 0.028 },
    [TransportMode.FerryFootPassenger]: { id: 52, emissionFactor: 0.0019 },
    [TransportMode.EBike]: { id: 53, emissionFactor: 0.003 },
  };