import { ParkService } from './../park-service/park.service';
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
  totalDayTime: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ParkComponent>,
    private http: HttpService,
    private parkService: ParkService
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.http.getVehicle(this.data.id).subscribe((res: any) => {
      this.vehicle = res.currentParking;
      this.parkingStartTime = res.currentParking.startTime;

      //TIME CONVERTION
      const milliseconds =
        new Date().getTime() - new Date(this.parkingStartTime).getTime();
      const seconds = this.parkService.milliSecondsToSeconds(milliseconds);
      const hours = this.parkService.milliSecondsToHour(milliseconds);
      const minutes = this.parkService.secondsToMinute(seconds);
      this.totalHours = hours;

      //roundup if minutes is >=30
      if (minutes > 29) this.totalHours = this.totalHours + 1;

      //If parking time does not exceed to 3hrs
      if (this.totalHours < 4) this.totalPrice = this.defaultPrice;
      //If parking time exceed to 3hrs but less than 1day
      else if (this.totalHours > 3 && this.totalHours < 24) {
        if (this.data.parkingSize === 1) {
          const multiplierPricePerHour = 20;
          const multiplier = this.totalHours - 3;

          this.totalPrice =
            this.defaultPrice + multiplierPricePerHour * multiplier;
        }
        if (this.data.parkingSize === 2) {
          const multiplierPricePerHour = 60;
          const multiplier = this.totalHours - 3;

          this.totalPrice =
            this.defaultPrice + multiplierPricePerHour * multiplier;
        }
        if (this.data.parkingSize === 3) {
          const multiplierPricePerHour = 100;
          const multiplier = this.totalHours - 3;

          this.totalPrice =
            this.defaultPrice + multiplierPricePerHour * multiplier;
        }
      }
      //If parking time exceeds or equal to 1 day
      else if (this.totalHours >= 24) {
        let basePricePerWholeDay = 5000;
        // this.totalHours = 48;

        let totalDay = this.totalHours / 24;
        const totalDayFinal: any = totalDay.toFixed(0);
        const totalPrice = totalDayFinal * basePricePerWholeDay;
        console.log(totalPrice);

        //exceeding hours of the day
        const currentDaySucceedingHours = this.totalHours % 24;
        let day = totalDayFinal > 1 ? 'Days' : 'Day';
        this.totalDayTime = `${totalDayFinal} ${day} and ${currentDaySucceedingHours} Hours`;

        // parking that exceeds days and has exceeding hours
        if (currentDaySucceedingHours !== 0) {
          if (this.data.parkingSize === 1) {
            const multiplierPricePerHour = 20;
            this.totalPrice =
              totalPrice + multiplierPricePerHour * currentDaySucceedingHours;
          }
          if (this.data.parkingSize === 2) {
            const multiplierPricePerHour = 60;
            this.totalPrice =
              totalPrice + multiplierPricePerHour * currentDaySucceedingHours;
          }
          if (this.data.parkingSize === 3) {
            const multiplierPricePerHour = 100;
            this.totalPrice =
              totalPrice + multiplierPricePerHour * currentDaySucceedingHours;
          }
        }
        //WILL DISPLAY STATIC PRICING FOR WHOLE DAYS with no exceeding hours >>> 5,000 per day
        else this.totalPrice = totalPrice;
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
