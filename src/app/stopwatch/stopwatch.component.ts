import { Component, OnInit, HostListener, Inject } from '@angular/core';
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
  timeInterval = 0;
  windowId = null;

  // @HostListener('window:storage', ['$event'])
  // storageChange(event) {
  //   this.chech;
  //   // this.stopwatchState.isStarted = fal;
  //   // this.storageService.savePropertyValue('isStarted', this.stopwatchState.isStarted);
  // }

  // @HostListener('click', ['$event'])
  // checkWindow(e) {
  //   this.windowId = this.storageService.getPropertyValue('windowId');
  // }

  constructor(private storageService: StorageHandlerService) { }

  ngOnInit() {
    this.eventHandler();
    this.checkStorage();
    // console.log(this.stopwatchState);
    // this.createWindowId();
  }

  ngOnDestroy() {
    // this.checkStorage();
  }

  createWindowId() {
    this.windowId = uuid();
    this.storageService.savePropertyValue('windowId', this.windowId);
    console.log(this.windowId);
  }

  eventHandler() {
    console.log('handlim');
    window.addEventListener('storage', this.checkStorage.bind(this));
  }

  handleStartStop() {
    console.log('inside start stop');
    // console.log(this.stopwatchState.isStarted);
    if (this.stopwatchState.isStarted) {
      clearInterval(this.timeInterval);
      this.stopwatchState.isStarted = false;
      this.storageService.savePropertyValue('state', this.stopwatchState);
      this.saveCurrentTime();
    } else {
      this.stopwatchState.isStarted = true;
      this.timeInterval = this.incrementTime();
    }
    console.log(this.stopwatchState.isStarted);
    // console.log(this.timeInterval);

    // this.storageService.savePropertyValue('timeInterval', this.timeInterval);
  }

  handleTimeStamp() {
    console.log(this.stopwatchState.isStarted);
    if (this.stopwatchState.isStarted) {
      let stampId = uuid();
      let newTimeStamp = {
        id: stampId,
        milliseconds: this.stopwatchState.milliseconds,
        seconds: this.stopwatchState.seconds,
        minutes: this.stopwatchState.minutes
      }
      this.timeStamps.unshift(newTimeStamp);
      console.log(this.timeStamps);
      this.storageService.savePropertyValue('timeStamps', this.timeStamps);
    }
  }

  removeTimeStamp(id) {
    this.timeStamps = this.timeStamps.filter(item => item.id !== id);
    this.storageService.savePropertyValue('timeStamps', this.timeStamps);
  }

  handleClear() {
    clearInterval(this.timeInterval);
    this.storageService.clearStorage();
    // let clearState = new StopWatchState(0,0,0,false);
    this.stopwatchState.isStarted = false;
    // this.stopwatchState = clearState;
    this.stopwatchState.milliseconds = 0;
    this.stopwatchState.seconds = 0;
    this.stopwatchState.minutes = 0;
    this.timeStamps = [];
    this.storageService.savePropertyValue('timeStamps', this.timeStamps);
    this.storageService.savePropertyValue('state', this.stopwatchState);
    this.saveCurrentTime();
  }

  incrementTime() {
    return setInterval(() => {
      this.stopwatchState.milliseconds+=1;
      if (this.stopwatchState.milliseconds % 100 === 0) {
        this.stopwatchState.seconds+=1;
        this.stopwatchState.milliseconds = 0;
      }
      if (this.stopwatchState.seconds % 60 === 0 && this.stopwatchState.milliseconds === 0) {
        this.stopwatchState.minutes+=1;
        this.stopwatchState.seconds = 0;
      }
      this.storageService.savePropertyValue('state', this.stopwatchState);
      this.saveCurrentTime();
    }, 10);
  }

  checkStorage() {
    let storedState = this.storageService.getPropertyValue('state');
    let storedTimeStamps = this.storageService.getPropertyValue('timeStamps');
    let storedTrueTime = this.storageService.getPropertyValue('syncTime');
    // console.log('inside check storage');
    // console.log(storedState);
    if (storedState) {
      if (!this.isStateEqual(storedState)) {
        // this.stopwatchState = new StopWatchState(storedState.milliseconds, storedState.seconds, storedState.minutes, storedState.isStarted);
        this.stopwatchState.milliseconds = storedState.milliseconds;
        this.stopwatchState.seconds = storedState.seconds;
        this.stopwatchState.minutes = storedState.minutes;
        console.log(this.stopwatchState.isStarted);
        console.log(storedState.isStarted);
        if (storedState.isStarted) {
          // if (storedWindowId === this.windowId) {
          let currentTime = Date.parse(new Date().toISOString());
          let elapsedTime = currentTime - storedTrueTime;
          if (elapsedTime > 850) {
            console.log(elapsedTime);
            console.log('restoring');
            this.convertStoredTime(elapsedTime);
            this.stopwatchState.isStarted = storedState.isStarted;
            this.timeInterval = this.incrementTime();
          }
        } else if (this.stopwatchState.isStarted && !storedState.isStarted) {
            this.handleStartStop();
        }
      }
    }
      if (storedTimeStamps) {
        this.timeStamps = storedTimeStamps;
      }
    // }
  }

  convertStoredTime(elapsedTime) {
    let normalizedTime = Math.floor(elapsedTime / 10);
    let milliseconds = normalizedTime % 100;
    let seconds = Math.floor(normalizedTime / 100);
    let minutes = Math.floor(seconds / 60);
    // console.log('ms '+milliseconds);
    // console.log('s '+seconds);
    // console.log('min '+minutes);
    let newMilliseconds = this.stopwatchState.milliseconds + milliseconds;
    let newSeconds = this.stopwatchState.seconds + seconds;
    if (newMilliseconds >= 100) {
      this.stopwatchState.milliseconds = newMilliseconds % 100;
      this.stopwatchState.seconds+=1;
    } else {
      this.stopwatchState.milliseconds = milliseconds;
    }
    if (newSeconds >= 60) {
      this.stopwatchState.seconds = newSeconds % 60;
      this.stopwatchState.minutes+=1;
    } else {
      this.stopwatchState.seconds = seconds;
    }
    this.stopwatchState.minutes = minutes;
    // console.log('new ms '+this.stopwatchState.milliseconds);
    // console.log('new s '+this.stopwatchState.seconds);
    // console.log('new min '+this.stopwatchState.minutes);
  }

  isStateEqual(state) {
    if (JSON.stringify(this.stopwatchState) == JSON.stringify(state)) {
      return true;
    } else {
      return false;
    }
  }

  saveCurrentTime() {
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
