import { ParkComponent } from './park/park.component';
import { HttpService } from './../http/http.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'parking-system';
  parkingArray: Array<any> = [];
  parkingA: Array<any> = [];
  parkingB: Array<any> = [];
  parkingC: Array<any> = [];

  vehicleDetails: FormGroup;
  checkIfExist: boolean = false;
  entryPoint: Array<any> = ['A', 'B', 'C'];
  vehicleSize: Array<any> = ['small', 'medium', 'large'];

  constructor(
    private http: HttpService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.fetchParking();

    this.vehicleDetails = this.fb.group({
      plateNumber: ['', Validators.required],
      brand: ['', Validators.required],
      entryPoint: ['', Validators.required],
      vehicleSize: ['', Validators.required],
    });

    // this.vehicleDetails.get('entryPoint')?.valueChanges.subscribe((res:any)=>{
    //   if(res==)
    // })
  }

  fetchParking() {
    this.http.getParkings().subscribe((res: any) => {
      this.parkingArray = res.parkings;
      this.parkingA = this.getParkingArr('A');
      this.parkingB = this.getParkingArr('B');
      this.parkingC = this.getParkingArr('C');
    });
  }

  getParkingArr(parking: string) {
    let arrCopy = this.parkingArray;
    return arrCopy.filter((p: any) => p.entryPoint === parking);
  }

  openParking() {
    const parkingValue = this.vehicleDetails.getRawValue();
    let data = {
      ...parkingValue,
      startTime: new Date(),
    };
    console.log(data);
    this.http.startParking(data).subscribe((res: any) => {
      console.log(res);
      this.vehicleDetails.reset();
      this.fetchParking();
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
