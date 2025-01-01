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
    DialogComponent
  ],
  templateUrl: './co2-calculator.component.html',
  styleUrls: ['./co2-calculator.component.scss']
})
export class Co2CalculatorComponent {
  history: Co2Calculator[] = [];
  subscription: Subscription | undefined;
  historyFormGroup: FormGroup;
  filterControl = new FormControl('');
  displayedColumns: string[] = ['fromCity', 'toCity', 'distance', 'distanceMode', 'co2'];
  from: string = ''; // Origin location
  to: string = ''; // Destination location
  distance: number | null = null; // Distance in kilometers
  mode: string = ''; // Mode of transport
  co2Emissions: number | null = null; // Calculated CO2 emissions
  private modeMapping: { [key: string]: { id: number; name: string } } = {
    car: { id: 1, name: 'Car' },
    bus: { id: 2, name: 'Bus' },
    train: { id: 3, name: 'Train' },
    flight: { id: 4, name: 'Flight' },
    tram: { id: 5, name: 'Tram' },
    velo: { id: 6, name: 'Velo' },
    truck: { id: 7, name: 'Truck' },
    boat: { id: 8, name: 'Boat' },
};

  constructor(private dialog: MatDialog,public userService:UserService, 
    private co2calculatorService:Co2CalculatorService) {this.historyFormGroup = new FormGroup({
      fromCity: new FormControl('', [Validators.required]),
      toCity: new FormControl('', [Validators.required]),
      distance: new FormControl(null, [Validators.required, Validators.min(1)]),
      mode: new FormControl('', [Validators.required]),
    })};
  getHistoryData() {
      this.co2calculatorService.getCo2CalculatorHistory().subscribe((polutionMapHistoryData) => {
        this.history = polutionMapHistoryData;
      });
      this.subscription = this.filterControl.valueChanges
        .pipe(
          debounceTime(500),
          switchMap(() => {
            return this.co2calculatorService.getCo2CalculatorHistory();
          })
        )
        .subscribe((response) => {
          this.history = response;
        });
    }
  
  switchFields() {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
  }
  ngOnInit() {
    

    if (this.userService.isLoggedInSignal()) {
      this.getHistoryData();
    }
  }

  calculateCO2(): void {
    // Check if the form is invalid
    if (this.historyFormGroup.invalid) {
        this.historyFormGroup.markAllAsTouched();
        this.showDialog('Please fill out all required fields correctly.');
        return;
    }

    // Get values from the form
    const { fromCity, toCity, distance, mode } = this.historyFormGroup.value;

    // Calculate CO2 emissions
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

    const co2Emissions = distance * (emissionFactors[mode] || 0);
    const distanceMode = this.modeMapping[mode];
    if (!distanceMode) {
        this.showDialog('Invalid mode of transport selected.');
        return;
    }

    // Save the CO2 calculation
    this.co2calculatorService.create({
        fromCity,
        toCity,
        distance,
        distanceMode: distanceMode.id, // Pass only the ID
        co2: co2Emissions,
    }).subscribe(() => {
        this.getHistoryData(); // Refresh history
        this.resetForm(); // Reset the form
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
