import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getParkings() {
    return this.http.get('http://localhost:4000/api/v1/parking');
  }

  startParking(data: Object) {
    return this.http.post('http://localhost:4000/api/v1/parking/check', data);
  }

  getVehicle(id: string) {
    return this.http.get(
      `http://localhost:4000/api/v1/parking/get-details/${id}`
    );
  }
  unpark(id: string) {
    return this.http.patch(`http://localhost:4000/api/v1/parking/${id}`, {});
  }
  checkHisotry(plateNo:string){
    return this.http.get(`http://localhost:4000/api/v1/parking/check-history/${plateNo}`)
  }
}
