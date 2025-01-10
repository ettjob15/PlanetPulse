import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; // Update the path if needed
import { UserService } from '../services/user.service';
import { Co2CalculatorService } from '../services/co2-calculator-service.service';
import { Co2Calculator,DistanceMode } from '../interfaces/co2-calculator';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { Validators } from '@angular/forms';
import{Chart,registerables} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);
Chart.register(...registerables);


@Component({
  selector: 'app-co2-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,    
    MatIconModule,  
    MatCardModule,
    MatNativeDateModule,
    MatPseudoCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    DialogComponent,
 

  ],
  templateUrl: './co2-calculator.component.html',
  styleUrls: ['./co2-calculator.component.scss']
})
export class Co2CalculatorComponent {
  chart: Chart | undefined;
  history: Co2Calculator[] = [];
  subscription: Subscription | undefined;
  historyFormGroup: FormGroup;
  filterDistanceMode = new FormControl(''); 
  sortOption = new FormControl('');
  sortOptionCo2 = new FormControl('');
  sortOptionDate = new FormControl('');
  sortOptionUnified = new FormControl('');
  filterControl = new FormControl('');
  searchControl = new FormControl('');
  fromCityControl = new FormControl('');
  toCityControl = new FormControl('');
  
  displayedColumns: string[] = ['fromCity', 'toCity', 'distance', 'distanceMode', 'co2', 'date'];

  from: string = ''; 
  to: string = ''; 
  distance: number | null = null; 
  mode: string = ''; 
  co2Emissions: number | null = null; 
  


  constructor(private dialog: MatDialog,public userService:UserService, 
    private co2calculatorService:Co2CalculatorService) {this.historyFormGroup = new FormGroup({
      fromCity: new FormControl('', [Validators.required]),
      toCity: new FormControl('', [Validators.required]),
      distance: new FormControl(null, [Validators.required, Validators.min(1)]),
      mode: new FormControl('', [Validators.required]),
    })};
  getHistoryData(searchTerm: string = '') {
    const distanceMode: string | undefined = this.filterDistanceMode.value || undefined;
    const sortOption = this.sortOptionUnified.value;
  
    let sortByDistance: string | undefined;
    let sortByCo2: string | undefined;
    let sortByDate: string | undefined;

      if (sortOption?.includes('distance')) {
        sortByDistance = sortOption;
    } else if (sortOption?.includes('co2')) {
      sortByCo2 = sortOption;
    } else if (sortOption?.includes('date')) {
      sortByDate = sortOption;
    }
   
      this.co2calculatorService.getCo2CalculatorHistory(distanceMode,sortByDistance,sortByCo2,sortByDate).subscribe((polutionMapHistoryData) => {
        this.history = polutionMapHistoryData;
        this.renderChart();
      });
      this.subscription = this.filterControl.valueChanges
        .pipe(
          debounceTime(500),
          switchMap(() => {
            return this.co2calculatorService.getCo2CalculatorHistory(distanceMode, sortByDistance, sortByDate,sortByCo2);
          })
        )
        .subscribe((response) => {
          this.history = response;
        });
      } 
    
      applySearch(searchTerm: string) {
        if (!searchTerm) {
          this.getHistoryData(); // Reset to original data if search is cleared
          return;
        }
    
        const lowercasedTerm = searchTerm.toLowerCase();
    
        // Filter the history data
        this.history = this.history.filter((entry) =>
          Object.values(entry).some((value) =>
            value.toString().toLowerCase().includes(lowercasedTerm)
          )
        );
      }



    renderChart() {
      const labels = this.history.map((item) => `${item.fromCity} → ${item.toCity}`);
    const data = this.history.map((item) => item.co2);

    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = document.getElementById('co2Chart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'CO₂ Emissions (kg)',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          y: {
            type: 'logarithmic', 
            ticks: {
              callback: function (value) {
                return Number(value.toString()); 
              },
            },
          },
        },
      },
    });
    }
  
    switchFields(): void {
      const from = this.fromCityControl.value;
      const to = this.toCityControl.value;
    
      this.fromCityControl.setValue(to); // Swap the values
      this.toCityControl.setValue(from);
    }

    filterFromCity(value: string | null): void {
      if (!value) {
        this.historyFormGroup.get('fromCity')?.setValue('');
        return;
      }
  
      // Ensure only letters are allowed
      const filteredValue = value.replace(/[^a-zA-Z]/g, '');
      this.historyFormGroup.get('fromCity')?.setValue(filteredValue, { emitEvent: false });
    }
  
    // Filter logic for To City
    filterToCity(value: string | null): void {
      if (!value) {
        this.historyFormGroup.get('toCity')?.setValue('');
        return;
      }
  
      // Ensure only letters are allowed
      const filteredValue = value.replace(/[^a-zA-Z]/g, '');
      this.historyFormGroup.get('toCity')?.setValue(filteredValue, { emitEvent: false });
    }
    
    ngOnInit() {
    

    if (this.userService.isLoggedInSignal()) {
      this.getHistoryData();
    }
    // Subscribe to fromCityControl changes
  this.fromCityControl.valueChanges.subscribe((value) => {
    this.filterFromCity(value);
  });

  // Subscribe to toCityControl changes
  this.toCityControl.valueChanges.subscribe((value) => {
    this.filterToCity(value);
  });

    this.filterDistanceMode.valueChanges.subscribe(() => {
      this.getHistoryData();
    });
  
    this.sortOptionUnified.valueChanges.subscribe(() => {
      this.getHistoryData();
    });

    this.searchControl.valueChanges.subscribe((searchTerm) => {
          if (searchTerm !== null) {
            this.applySearch(searchTerm); // Apply search filtering
          }
        });
  }
  
  
  calculateCO2(): void {
    
    if (this.historyFormGroup.invalid) {
      this.historyFormGroup.markAllAsTouched();
      this.showDialog('Please fill out all required fields correctly.');
      return;
    }
  
    
    const { fromCity, toCity, distance, mode } = this.historyFormGroup.value;
  
   
    const modeMapping: { [key: string]: number } = {
      Domestic_flight: 39,
      Diesel_car: 40,
      Petrol_car: 41,
      Short_haul_flight: 42,
      Long_haul_flight: 43,
      Motorbike: 44,
      Bus: 45,
      Bus_city: 46,
      Plug_in_hybrid: 47,
      Electric_car: 48,
      National_rail: 49,
      Tram: 50,
      Underground: 51,
      Ferry_foot_passenger: 52,
      e_bike: 53
    };
  
    
    const distanceModeId = modeMapping[mode];
  
    if (!distanceModeId) {
      this.showDialog('Invalid mode of transport selected.');
      return;
    }
  
    console.log("Selected Mode ID:", distanceModeId);  
  
    const emissionFactors: { [key: string]: number } = {
      Domestic_flight: 0.246,
      Diesel_car: 0.171,
      Petrol_car: 0.170,
      Short_haul_flight: 0.151,
      Long_haul_flight: 0.148,
      Motorbike: 0.114,
      Bus: 0.097,
      Bus_city: 0.079,
      Plug_in_hybrid: 0.068,
      Electric_car: 0.047,
      National_rail: 0.035,
      Tram: 0.0029,
      Underground: 0.028,
      Ferry_foot_passenger: 0.0019,
      e_bike: 0.003
    };
    const co2Emissions = distance * (emissionFactors[mode] || 0);

    this.co2calculatorService.create({
      fromCity,
      toCity,
      distance,
      distanceMode: distanceModeId,  
      co2: co2Emissions
    }).subscribe(() => {
      this.getHistoryData();  
      this.resetForm();       
      this.showDialog('Calculation saved successfully!');
    });
  }
  
  
  
  
  getEmissionFactor(mode: string): number | undefined {
    const emissionFactors: { [key: string]: number } = {
      car: 0.2,
      bus: 0.05,
      train: 0.03,
      flight: 0.25,
      tram: 0.02,
      velo: 0,
      truck: 0.3,
      boat: 0.15,
    };
  
    return emissionFactors[mode];
  }  
  

  resetForm(): void {
    this.historyFormGroup.reset();
    this.historyFormGroup.markAsPristine();
    this.historyFormGroup.markAsUntouched();
  }
  

  showDialog(message: string) {
    this.dialog.open(DialogComponent, {
      data: { message }
    });
  }
  
}
