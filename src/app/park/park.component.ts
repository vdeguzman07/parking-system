import { HttpService } from './../../http/http.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-park',
  templateUrl: './park.component.html',
  styleUrls: ['./park.component.scss'],
})
export class ParkComponent implements OnInit {
  vehicle: any;
  parkingStartTime: any;
  defaultPrice = 40;
  totalHours: any;
  totalPrice: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ParkComponent>,
    private http: HttpService
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.http.getVehicle(this.data.id).subscribe((res: any) => {
      this.vehicle = res.currentParking;
      console.log(this.vehicle);
      this.parkingStartTime = res.currentParking.startTime;
      let milliseconds =
        new Date().getTime() - new Date(this.parkingStartTime).getTime();
      let seconds = Math.floor(milliseconds / 1000);
      let hours = Math.floor(milliseconds / 3600000);
      let minutes = Math.floor(seconds / 60) % 60;

      console.log(`${hours}:${minutes}`);

      this.totalHours = hours;
      if (minutes > 29) this.totalHours = this.totalHours + 1;

      console.log(this.totalHours, 'TOTALLLLLL');
      //LOGIC IN CALCULATION OF FEES

      if (this.totalHours < 4) {
        this.totalPrice = this.defaultPrice;
        console.log(this.totalPrice);
      } else if (this.totalHours > 3 && this.totalHours < 24) {
        if (this.data.parkingSize === 1) {
          const multiplierPrice = 20;
          const multiplier = this.totalHours - 3;

          const totalPayable = this.defaultPrice + multiplierPrice * multiplier;
          this.totalPrice = totalPayable;
          console.log(this.totalPrice);
        }
        if (this.data.parkingSize === 2) {
          const multiplierPrice = 60;
          const multiplier = this.totalHours - 3;

          const totalPayable = this.defaultPrice + multiplierPrice * multiplier;
          this.totalPrice = totalPayable;
          console.log(this.totalPrice);
        }
        if (this.data.parkingSize === 3) {
          const multiplierPrice = 100;
          const multiplier = this.totalHours - 3;

          const totalPayable = this.defaultPrice + multiplierPrice * multiplier;
          this.totalPrice = totalPayable;
          console.log(this.totalPrice);
        }
      } else if (this.totalHours == 24) {
        this.totalPrice = 5000;
        const staticPrice = 5000;
        if (this.data.parkingSize === 1) {
          const multiplierPrice = 20;
          const multiplier = this.totalHours - 3;

          const totalPayable = staticPrice + multiplierPrice * multiplier;
          this.totalPrice = totalPayable;
          console.log(this.totalPrice);
        }
        if (this.data.parkingSize === 2) {
          const multiplierPrice = 60;
          const multiplier = this.totalHours - 3;

          const totalPayable = staticPrice + multiplierPrice * multiplier;
          this.totalPrice = totalPayable;
          console.log(this.totalPrice);
        }
        if (this.data.parkingSize === 3) {
          const multiplierPrice = 100;
          const multiplier = this.totalHours - 3;

          const totalPayable = staticPrice + multiplierPrice * multiplier;
          this.totalPrice = totalPayable;
          console.log(this.totalPrice);
        }
      }
    });
  }

  unPark() {
    this.http.unpark(this.data.id).subscribe((res: any) => {
      console.log(res);
      this.dialogRef.close(res);
    });
  }
}
