import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParkService {
  constructor() {}

  milliSecondsToSeconds(milliseconds: number): number {
    return Math.floor(milliseconds / 1000);
  }

  milliSecondsToHour(milliseconds: number): number {
    return Math.floor(milliseconds / 3600000);
  }

  secondsToMinute(seconds: number): number {
    return Math.floor(seconds / 60) % 60;
  }
}
