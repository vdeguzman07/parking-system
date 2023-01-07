import { ParkingFormComponent } from './parking-form/parking-form.component';
import { ParkComponent } from './park/park.component';
import { HttpService } from './../http/http.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  formValue: any;
  @ViewChild(ParkingFormComponent) parkingForm!: ParkingFormComponent;
  parkingArray: Array<any> = [];
  parkingA: Array<any> = [];
  parkingB: Array<any> = [];
  parkingC: Array<any> = [];

  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private sb: MatSnackBar
  ) {
    this.fetchParking();
  }

  fetchParking() {
    this.http.getParkings().subscribe((res: any) => {
      this.parkingArray = res.parkings;
      this.parkingA = this.getParkingArr('A');
      this.parkingB = this.getParkingArr('B');
      this.parkingC = this.getParkingArr('C');
    });
  }

  getFormValues(event: any) {
    this.formValue = event;
    console.log(this.formValue);
    this.startParking();
  }

  getParkingArr(parking: string) {
    let arrCopy = this.parkingArray;
    return arrCopy.filter((p: any) => p.entryPoint === parking);
  }

  startParking() {
    this.formValue.startTime = new Date();
    //CHECK HISTORY FOR CONTINOUS PAYMENT
    this.http.checkHisotry(this.formValue.plateNumber).subscribe((res: any) => {
      console.log(res);
      //IF VEHICLE CAMEBACK WITHIN 1HR CHARGE WILL CONTINUE
      if (res.continousPayment === true) {
        this.sb.open(
          'Our System Detected that you returned in our parking complex within 1 hour, continous rate will apply',
          'ok',
          { duration: 15000, panelClass: ['failed'] }
        );
        this.formValue.startTime = new Date(res.history[0].startTime);
      }

      this.http.startParking(this.formValue).subscribe((res: any) => {
        console.log(res);
        this.parkingForm.vehicleDetails.reset();
        this.fetchParking();
      });
    });
  }

  showDetails(data: any) {
    console.log(data);
    if (data.status === 'available') return;
    this.dialog
      .open(ParkComponent, {
        data: { id: data._id, parkingSize: data.parkingSize },
        width: '40vw',
        height: 'auto',
      })
      .afterClosed()
      .subscribe((res: any) => {
        console.log(res);
        if (res) this.fetchParking();
      });
  }
}
