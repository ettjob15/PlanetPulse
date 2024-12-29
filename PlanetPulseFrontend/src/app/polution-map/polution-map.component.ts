import { Component, signal } from '@angular/core';
import * as L from 'leaflet';
import { OpenweatherService } from '../services/openweather.service';



@Component({
  selector: 'app-polution-map',
  standalone: true,
  imports: [],
  templateUrl: './polution-map.component.html',
  styleUrl: './polution-map.component.scss'
})

export class PolutionMapComponent {
  cityName = signal('');
  cityNameDisplay = signal('');
  airQualityIndex = signal<number | null>(null);
  cityNotFound = signal(false);
  map!: L.Map;
  marker!: L.Marker;
  aqiCircle!: L.Circle;
  isBubbleExpanded = false;
  geoJsonLayer!: L.GeoJSON;

  constructor(private openWeatherService: OpenweatherService) { }

  ngOnInit() {
    this.initializeMap();
    this.autoLocateUser();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  toggleAqiBubble() {
    this.isBubbleExpanded = !this.isBubbleExpanded;
  }

  initializeMap() {
    this.map = L.map('map').setView([48.8566, 2.3522], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  autoLocateUser() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
  
          this.updateMapLocation(lat, lon);
          this.openWeatherService.getAirPollution(lat, lon).subscribe({

            next: (pollutionData) => {
              const aqi = pollutionData.list[0].main.aqi;
  
              // Extract pollutant components
              const pollutants = {
                CO: pollutionData.list[0].components.co,
                NO: pollutionData.list[0].components.no,
                NO2: pollutionData.list[0].components.no2,
                O3: pollutionData.list[0].components.o3,
                SO2: pollutionData.list[0].components.so2,
                PM2_5: pollutionData.list[0].components.pm2_5,
                PM10: pollutionData.list[0].components.pm10,
                NH3: pollutionData.list[0].components.nh3,
              };
  
              this.airQualityIndex.set(aqi);
  
              this.fetchCityBoundaries(lat, lon, aqi, pollutants);
            },
            error: (err) => console.error('Error fetching pollution data:', err),
          });
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation not supported in this browser.');
    }
  }
  

 /*  drawAqiCircle(lat: number, lon: number, aqi: number) {
    let circleColor = 'green'; // default
    switch (aqi) {
      case 1:
        circleColor = 'green';
        break;
      case 2:
        circleColor = 'yellow';
        break;
      case 3:
        circleColor = 'orange';
        break;
      case 4:
        circleColor = 'red';
        break;
      case 5:
        circleColor = 'purple';
        break;
      default:
        circleColor = 'gray';
        break;
    }

    if (this.aqiCircle) {
      this.map.removeLayer(this.aqiCircle);
    }

    this.aqiCircle = L.circle([lat, lon], {
      color: circleColor,
      fillColor: circleColor,
      fillOpacity: 0.3,
      radius: 5000
    });

    this.aqiCircle.addTo(this.map);
  } */

  searchCity() {
    const city = this.cityName();
    if (!city) return;
    this.cityNameDisplay.set(city);
    this.openWeatherService.getCityCoordinates(city).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const { lat, lon } = res[0];

        

          this.cityNotFound.set(false);
          this.updateMapLocation(lat, lon);

          this.openWeatherService.getAirPollution(lat, lon).subscribe({
            next: (pollutionData) => {
              const aqi = pollutionData.list[0].main.aqi;
  
              // Extract pollutant components
              const pollutants = {
                CO: pollutionData.list[0].components.co,
                NO: pollutionData.list[0].components.no,
                NO2: pollutionData.list[0].components.no2,
                O3: pollutionData.list[0].components.o3,
                SO2: pollutionData.list[0].components.so2,
                PM2_5: pollutionData.list[0].components.pm2_5,
                PM10: pollutionData.list[0].components.pm10,
                NH3: pollutionData.list[0].components.nh3,
              };
              
              // OpenWeather structure => pollutionData.list[0].main.aqi
              this.airQualityIndex.set(pollutionData.list[0].main.aqi);
              this.fetchCityBoundaries(lat, lon, this.airQualityIndex()!,pollutants);
              /* this.drawAqiCircle(lat, lon, this.airQualityIndex()!); */
            },
            error: (err) => console.error(err),
          });
        } else {
          this.cityNotFound.set(true);
          console.error('City not found');
        }
      },
      error: (err) => console.error(err),
    });
  }

  updateMapLocation(lat: number, lon: number) {
    this.map.setView([lat, lon], 10);

    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.map.invalidateSize();
    }

    this.marker = L.marker([lat, lon]).addTo(this.map);
    this.map.invalidateSize();

  }

  filterInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.cityName.set(inputElement.value); // cityName aktualisieren
  }

  fetchCityBoundaries(lat: number, lon: number, aqi: number, pollutants: Record<string, number>) {
    const apiKey = 'e49b6d1e3dc341adbbf8d34997c0c5b5'; 
    const url = `https://api.geoapify.com/v1/boundaries/part-of?lat=${lat}&lon=${lon}&geometry=geometry_1000&apiKey=${apiKey}`;

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.features && data.features.length > 0) {
        let selectedFeature = null;
        let cityName = 'Brno';

        for (const feature of data.features) {
          const categories = feature.properties.categories;

          if (
            categories?.includes("administrative.neighbourhood_level") ||
            categories?.includes("administrative.suburb_level")
          ) {
            console.log(
              'Lower-level boundary found (neighbourhood or suburb), skipping:',
              feature
            );
            continue;
          }
          if (feature.properties.city) {
            cityName = feature.properties.city;
          }

          selectedFeature = feature;
          break;
        }

        if (selectedFeature) {
          console.log('Selected Feature:', selectedFeature);
          selectedFeature.properties = {
            ...selectedFeature.properties,
            aqi,
            ...pollutants,
          };
          this.cityNameDisplay.set(cityName);

          this.addStyledBoundaryToMap(selectedFeature);
        } else {
          console.error('No suitable feature found for the specified location.');
        }
      } else {
        console.error('No boundary data found for the specified location.');
      }
    })
    .catch((error) => console.error('Error fetching boundary data:', error));
}

addStyledBoundaryToMap(geoJsonFeature: any) {
  if (this.geoJsonLayer) {
    this.map.removeLayer(this.geoJsonLayer);
  }

  this.geoJsonLayer = L.geoJSON(geoJsonFeature, {
    style: (feature) => ({
      color: this.getAqiColor(feature?.properties?.aqi || null),
      weight: 2,
      opacity: 0.65,
      fillOpacity: 0.5,
    }),
    onEachFeature: (feature, layer) => {
      this.onEachFeature(feature, layer);
    },
  }).addTo(this.map);

  this.map.fitBounds(this.geoJsonLayer.getBounds());
}

onEachFeature(feature: any, layer: any) {
  layer.on('mouseover', (e: any) => this.highlightFeature(e));
  layer.on('mouseout', (e: any) => this.resetHighlight(e));
  layer.on('click', (e: any) => this.zoomToFeature(e));
}

highlightFeature(e: any) {
  const layer = e.target;

  layer.setStyle({
    weight: 3,
    color: '#000', // Stronger border color
    dashArray: '',
    fillOpacity: 0.8, // More opaque when highlighted
  });

  const popupContent = this.getAqiPopupContent(layer.feature.properties);
  layer.bindPopup(popupContent).openPopup();
}


resetHighlight(e: any) {
  this.geoJsonLayer.resetStyle(e.target);
}

zoomToFeature(e: any) {
  this.map.fitBounds(e.target.getBounds());
}

  getAqiColor(aqi: number | null): string {
    switch (aqi) {
      case 1:
        return 'green'; 
      case 2:
        return 'yellow'; 
      case 3:
        return 'orange'; 
      case 4:
        return 'red'; 
      case 5:
        return 'purple'; 
      default:
        return 'gray'; 
    }
  }
  getAqiPopupContent(properties: any): string {
    const { aqi, CO, NO, NO2, O3, SO2, PM2_5, PM10, NH3 } = properties;
  
    if (aqi === null) return 'AQI data not available.';
  
    const aqiDetails: Record<number, { level: string; description: string }> = {
      1: { level: 'Good', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
      2: { level: 'Fair', description: 'Air quality is acceptable. However, there may be a risk for sensitive people.' },
      3: { level: 'Moderate', description: 'Sensitive groups may experience health effects. General public less likely.' },
      4: { level: 'Poor', description: 'Some health effects for the general public; sensitive groups may experience more serious effects.' },
      5: { level: 'Very Poor', description: 'Health alert: Everyone may experience serious health effects.' },
    };
  
    const details = aqiDetails[aqi];
  
    return `
      <div>
        <strong>Air Quality: ${details.level}</strong>
        <p>${details.description}</p>
        <ul>
          <li><span style="color:${this.getPollutantColor('CO', CO)};font-weight:bold;text-shadow: 1px 1px 2px black;">CO</span>: ${CO !== undefined ? CO.toFixed(2) : 'N/A'} μg/m³</li>
          <li><span style="color:${this.getPollutantColor('NO2', NO2)};font-weight:bold;text-shadow: 1px 1px 2px black;">NO2</span>: ${NO2 !== undefined ? NO2.toFixed(2) : 'N/A'} μg/m³</li>
          <li><span style="color:${this.getPollutantColor('O3', O3)};font-weight:bold;text-shadow: 1px 1px 2px black;">O3</span>: ${O3 !== undefined ? O3.toFixed(2) : 'N/A'} μg/m³</li>
          <li><span style="color:${this.getPollutantColor('SO2', SO2)};font-weight:bold;text-shadow: 1px 1px 2px black;">SO2</span>: ${SO2 !== undefined ? SO2.toFixed(2) : 'N/A'} μg/m³</li>
          <li><span style="color:${this.getPollutantColor('PM2_5', PM2_5)};font-weight:bold;text-shadow: 1px 1px 2px black;">PM2.5</span>: ${PM2_5 !== undefined ? PM2_5.toFixed(2) : 'N/A'} μg/m³</li>
          <li><span style="color:${this.getPollutantColor('PM10', PM10)};font-weight:bold;text-shadow: 1px 1px 2px black;">PM10</span>: ${PM10 !== undefined ? PM10.toFixed(2) : 'N/A'} μg/m³</li>
          <li><span style="font-weight:bold;text-shadow: 1px 1px 2px black;">NH3</span>: ${NH3 !== undefined ? NH3.toFixed(2) : 'N/A'} μg/m³</li>
        </ul>
      </div>
    `;
  }
  
  
getPollutantColor(pollutant: string, value: number): string {
  const ranges: Record<string, { min: number; max: number | null; color: string }[]> = {
    SO2: [
      { min: 0, max: 20, color: 'green' },
      { min: 20, max: 80, color: 'yellow' },
      { min: 80, max: 250, color: 'orange' },
      { min: 250, max: 350, color: 'red' },
      { min: 350, max: null, color: 'purple' },
    ],
    NO2: [
      { min: 0, max: 40, color: 'green' },
      { min: 40, max: 70, color: 'yellow' },
      { min: 70, max: 150, color: 'orange' },
      { min: 150, max: 200, color: 'red' },
      { min: 200, max: null, color: 'purple' },
    ],
    PM10: [
      { min: 0, max: 20, color: 'green' },
      { min: 20, max: 50, color: 'yellow' },
      { min: 50, max: 100, color: 'orange' },
      { min: 100, max: 200, color: 'red' },
      { min: 200, max: null, color: 'purple' },
    ],
    PM2_5: [
      { min: 0, max: 10, color: 'green' },
      { min: 10, max: 25, color: 'yellow' },
      { min: 25, max: 50, color: 'orange' },
      { min: 50, max: 75, color: 'red' },
      { min: 75, max: null, color: 'purple' },
    ],
    O3: [
      { min: 0, max: 60, color: 'green' },
      { min: 60, max: 100, color: 'yellow' },
      { min: 100, max: 140, color: 'orange' },
      { min: 140, max: 180, color: 'red' },
      { min: 180, max: null, color: 'purple' },
    ],
    CO: [
      { min: 0, max: 4400, color: 'green' },
      { min: 4400, max: 9400, color: 'yellow' },
      { min: 9400, max: 12400, color: 'orange' },
      { min: 12400, max: 15400, color: 'red' },
      { min: 15400, max: null, color: 'purple' },
    ],
  };

  const pollutantRanges = ranges[pollutant];
  if (!pollutantRanges) return 'gray'; // Default color if pollutant not found

  for (const range of pollutantRanges) {
    if (value >= range.min && (range.max === null || value < range.max)) {
      return range.color;
    }
  }

  return 'gray'; // Default color if no range matches
}

  
  
}


  
