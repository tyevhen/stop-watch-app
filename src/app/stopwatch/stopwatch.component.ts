import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, Inject } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { StopWatchState } from '../stop-watch-state';
import { StorageHandlerService } from '../storage-handler.service';


@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css'],
})

export class StopwatchComponent implements OnInit {
  stopwatchState = new StopWatchState(0,0,0,false);
  timeStamps = [];
  timeInterval = null;
  windowOpened = null;

  @HostListener('window:storage', ['$event'])
  listenStorage(e) {
    // console.log('Storage:', e);
    this.checkStorage(e.storageArea);
  }

  constructor(private storageService: StorageHandlerService) {
  }

  ngOnInit() {
    this.checkStorageOnInit();
  }

  ngOnDestroy() {
    this.saveTime();
    this.storageService.savePropertyValue('timeStamps', this.timeStamps);
  }

  handleStartStop() {
    if (this.stopwatchState.isStarted) {
      this.stopwatchState.isStarted = false;
      this.storageService.savePropertyValue('isStarted', this.stopwatchState.isStarted);
      this.timeInterval = clearInterval(this.timeInterval);
      this.saveTime();
    } else if (!this.stopwatchState.isStarted) {
      this.stopwatchState.isStarted = true;
      this.storageService.savePropertyValue('isStarted', this.stopwatchState.isStarted);
      this.timeInterval = this.incrementTime();
    }
  }

  addTimeStamp() {
    if (this.stopwatchState.isStarted) {
      let stampId = uuid();
      let newTimeStamp = {
        id: stampId,
        milliseconds: this.stopwatchState.milliseconds,
        seconds: this.stopwatchState.seconds,
        minutes: this.stopwatchState.minutes
      }
      this.timeStamps.unshift(newTimeStamp);
      this.storageService.savePropertyValue('timeStamps', this.timeStamps);
    }
  }

  removeTimeStamp(id) {
    this.timeStamps = this.timeStamps.filter(item => item.id !== id);
    this.storageService.savePropertyValue('timeStamps', this.timeStamps);
  }

  handleClear() {
    this.timeInterval = clearInterval(this.timeInterval);
    this.stopwatchState.isStarted = false;
    this.stopwatchState.milliseconds = 0;
    this.stopwatchState.seconds = 0;
    this.stopwatchState.minutes = 0;
    this.saveTime();
    this.storageService.savePropertyValue('isStarted', this.stopwatchState.isStarted);
    this.timeStamps = [];
    this.storageService.savePropertyValue('timeStamps', this.timeStamps);
  }

  incrementTime() {
    return setInterval(() => {
      this.stopwatchState.milliseconds++;
      if (this.stopwatchState.milliseconds % 100 === 0) {
        this.stopwatchState.seconds++;
        this.stopwatchState.milliseconds = 0;
      }
      if (this.stopwatchState.seconds % 60 === 0 && this.stopwatchState.milliseconds === 0) {
        this.stopwatchState.minutes++;
        this.stopwatchState.seconds = 0;
      }
      this.saveTime();
    }, 10);
  }

  checkStorage(e) {
    if (e !== undefined) {
      let storedIsStarted = JSON.parse(e.isStarted);
      let time = JSON.parse(e.time);
      if (this.stopwatchState.isStarted !== storedIsStarted) {
        this.stopwatchState.isStarted = storedIsStarted;
      }
      if (!this.stopwatchState.isTimeEqual(time)) {
        this.stopwatchState.seconds = time.seconds;
        this.stopwatchState.milliseconds = time.milliseconds;
        this.stopwatchState.minutes = time.minutes;
      }
      if (!storedIsStarted) {
        this.timeInterval = clearInterval(this.timeInterval);
      }
      this.timeStamps = JSON.parse(e.timeStamps);
    }
  }

  checkStorageOnInit() {
    let storedTime = this.storageService.getPropertyValue('time');
    let storedIsStarted = this.storageService.getPropertyValue('isStarted');
    let storedTimeStamps = this.storageService.getPropertyValue('timeStamps');
    let storedTrueTime = this.storageService.getPropertyValue('syncTime');
    if (storedTime !== undefined) {
      if (!this.stopwatchState.isTimeEqual(storedTime)) {
        this.stopwatchState.milliseconds = storedTime.milliseconds;
        this.stopwatchState.seconds = storedTime.seconds;
        this.stopwatchState.minutes = storedTime.minutes;
        this.stopwatchState.isStarted = storedIsStarted;
      }
      if (this.stopwatchState.isStarted) {
        let currentTime = Date.parse(new Date().toISOString());
        let elapsedTime = currentTime - storedTrueTime;
        if (elapsedTime > 1000) {
          this.convertStoredTime(elapsedTime);
          this.timeInterval = this.incrementTime();
          this.storageService.savePropertyValue('isStarted', true);
        }
      }
      if (storedTimeStamps !== undefined) {
        this.timeStamps = storedTimeStamps;
      }
    }
  }

  convertStoredTime(elapsedTime) {
    let normalizedTime = Math.floor(elapsedTime / 10);
    let milliseconds = normalizedTime % 100;
    let seconds = Math.floor(normalizedTime / 100);
    let minutes = Math.floor(seconds / 60);
    let newMilliseconds = this.stopwatchState.milliseconds + milliseconds;
    let newSeconds = this.stopwatchState.seconds + seconds;

    if (newMilliseconds >= 100) {
      this.stopwatchState.milliseconds = newMilliseconds % 100;
      this.stopwatchState.seconds++;
    } else {
      this.stopwatchState.milliseconds = milliseconds;
    }

    if (newSeconds >= 60) {
      this.stopwatchState.seconds = newSeconds % 60;
      this.stopwatchState.minutes++;
    } else {
      this.stopwatchState.seconds = seconds;
    }
    this.stopwatchState.minutes = minutes;
  }

  saveTime() {
    let time = {
      milliseconds: this.stopwatchState.milliseconds,
      seconds: this.stopwatchState.seconds,
      minutes: this.stopwatchState.minutes
    };
    this.storageService.savePropertyValue('time', time);
    let currentTime = new Date().toISOString();
    this.storageService.savePropertyValue('syncTime', Date.parse(currentTime));
  }


  blinkDelimiter() {
    if (this.stopwatchState.isStarted) {
      return setInterval(() => {

      })
    }
  }

}
