export class StopWatchState {
  milliseconds: number;
  seconds: number;
  minutes: number;
  isStarted: boolean;

  constructor(milliseconds, seconds, minutes, isStarted) {
    this.milliseconds = milliseconds,
    this.seconds = seconds,
    this.minutes = minutes,
    this.isStarted = isStarted
  }

  public isTimeEqual(time) {
    if (this.milliseconds !== time.milliseconds ||
        this.seconds !== time.seconds ||
        this.minutes !== time.minutes ) {
          return false;
        } else {
          return true;
        }
  }
}
