import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; // Update the path if needed
import { UserService } from '../services/user.service';
import { Co2CalculatorServiceService } from '../services/co2-calculator-service.service';

@Component({
  selector: 'app-co2-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  from: string = ''; // Origin location
  to: string = ''; // Destination location
  distance: number | null = null; // Distance in kilometers
  mode: string = ''; // Mode of transport
  co2Emissions: number | null = null; // Calculated CO2 emissions
  history: { from: string; to: string; distance: number; mode: string; co2: number }[] = []; // History of calculations

  constructor(private dialog: MatDialog,public userservice:UserService, 
    private co2calculatorService:Co2CalculatorServiceService) {}

  
  switchFields() {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
  }


  calculateCO2() {
    if (!this.from.trim()) {
      this.showDialog('Please enter a valid "From" location.');
      return;
    }
  
    if (!this.to.trim()) {
      this.showDialog('Please enter a valid "To" location.');
      return;
    }
  
    if (this.distance === null || this.distance <= 0) {
      this.showDialog('Please insert a positive value.');
      return;
    }
  
    if (!this.mode) {
      this.showDialog('Please select a mode of transport.');
      return;
    }
  
    const emissionFactors: { [key: string]: number } = {
      car: 0.2,
      bus: 0.05,
      train: 0.03,
      flight: 0.25,
      tram: 0.02,
      velo: 0,
      truck: 0.3,
      boat: 0.15
    };
  
    this.co2Emissions = this.distance * (emissionFactors[this.mode] || 0);
  
    // Add to history
    this.history.push({
      from: this.from,
      to: this.to,
      distance: this.distance,
      mode: this.mode,
      co2: this.co2Emissions
    });
  
    this.resetForm();
  }
  

  resetForm() {
    this.from = '';
    this.to = '';
    this.distance = null;
    this.mode = '';
    this.co2Emissions = null;
  }

  showDialog(message: string) {
    this.dialog.open(DialogComponent, {
      data: { message }
    });
  }
}
