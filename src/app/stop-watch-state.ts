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
}
