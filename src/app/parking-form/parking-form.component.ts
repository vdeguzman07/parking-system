import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-parking-form',
  templateUrl: './parking-form.component.html',
  styleUrls: ['./parking-form.component.scss'],
})
export class ParkingFormComponent implements OnInit {
  @Output() emitValue = new EventEmitter();
  vehicleDetails: FormGroup;
  entryPoint: Array<any> = ['A', 'B', 'C'];
  vehicleSize: Array<any> = ['small', 'medium', 'large'];
  brands: Array<any> = [
    'Toyota',
    'BMW',
    'Mitsubishi',
    'Nissan',
    'Mercedes Benz',
    'Audi',
    'KIA',
    'Chevrolet',
    'Ferrari',
  ];

  constructor(private sb: MatSnackBar, private fb: FormBuilder) {
    this.vehicleDetails = this.fb.group({
      plateNumber: ['', Validators.required],
      // brand: ['', Validators.required],
      entryPoint: ['', Validators.required],
      vehicleSize: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  startParking() {
    this.emitValue.emit(this.vehicleDetails.getRawValue());
  }
}
