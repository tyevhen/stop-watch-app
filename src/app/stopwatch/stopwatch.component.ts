import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { StopWatchState } from '../state/stop-watch-state';
import { StorageHandlerService } from '../services/storage-handler.service';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css'],
})

export class StopwatchComponent implements OnInit {
  stopwatchState = new StopWatchState(0,0,0,false);
  timeStamps = [];
  timeInterval = null;
  blinkInterval = null;
  isDelimShown = true;

  // Listening storage changes.
  @HostListener('window:storage', ['$event'])
  listenStorage(e) {
    this.syncStorage(e.storageArea);
  }

  constructor(private storageService: StorageHandlerService) {
  }

  ngOnInit() {
    this.checkStorageOnInit();
    this.windowEventBinding();
  }

  ngOnDestroy() {
    this.saveTime();
    this.saveCurrentTime();
    this.storageService.savePropertyValue(this.stopwatchState.isStarted);
  }

  // Bind window load/unload events with respective methods.
  windowEventBinding(){
    window.onload = this.addWindow.bind(this);
    window.onbeforeunload = this.deleteWindow.bind(this);
  }

  // Increment windows count.
  addWindow() {
    let windowCount = this.storageService.getPropertyValue('windowCount');
    if (windowCount < 0 ) {
      windowCount = 0;
    }
    this.storageService.savePropertyValue('windowCount', windowCount+1);
  }

  // Decrement windows count.
  deleteWindow() {
    let windowCount = this.storageService.getPropertyValue('windowCount');
    this.storageService.savePropertyValue('windowCount', windowCount-1);
  }

  // Method attached to start/stop button.
  handleStartStop() {
    if (this.stopwatchState.isStarted) {
      this.stopwatchState.isStarted = false;
      this.storageService.savePropertyValue('isStarted', this.stopwatchState.isStarted);
      this.timeInterval = clearInterval(this.timeInterval);
      this.blinkDelimiter();
      this.isDelimShown = true;
      this.saveTime();
      this.saveCurrentTime();
    } else if (!this.stopwatchState.isStarted) {
      this.stopwatchState.isStarted = true;
      this.storageService.savePropertyValue('isStarted', this.stopwatchState.isStarted);
      this.timeInterval = this.incrementTime();
      this.blinkInterval = this.blinkDelimiter();
    }
  }

  // Method that increments time.
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
      this.saveCurrentTime();
    }, 10);
  }

  // Method attached to "timestamp" button: adds timestamp.
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

  // Method attached to remove timestamp button: removes timestamp by id.
  removeTimeStamp(id) {
    this.timeStamps = this.timeStamps.filter(item => item.id !== id);
    this.storageService.savePropertyValue('timeStamps', this.timeStamps);
  }

  // Method attached to reset button: resets all data and stops time.
  handleClear() {
    this.timeInterval = clearInterval(this.timeInterval);
    this.isDelimShown = true;
    this.stopwatchState.isStarted = false;
    this.stopwatchState.milliseconds = 0;
    this.stopwatchState.seconds = 0;
    this.stopwatchState.minutes = 0;
    this.saveTime();
    this.storageService.savePropertyValue('isStarted', this.stopwatchState.isStarted);
    this.timeStamps = [];
    this.storageService.savePropertyValue('timeStamps', this.timeStamps);
    this.blinkDelimiter();
  }

  // Method that synchronizes new pages by storage change event.
  syncStorage(e) {
    if (e !== null && e !== undefined && e.length) {
      let storedIsStarted = JSON.parse(e.isStarted);
      let storedTime = JSON.parse(e.time);
      let storedWindowCount = JSON.parse(e.windowCount);

      this.stopwatchState.seconds = storedTime.seconds;
      this.stopwatchState.milliseconds = storedTime.milliseconds;
      this.stopwatchState.minutes = storedTime.minutes;

      if (this.stopwatchState.isStarted !== storedIsStarted) {
        this.stopwatchState.isStarted = storedIsStarted;
        this.blinkInterval = this.blinkDelimiter();
      }

      if (!storedIsStarted) {
        this.timeInterval = clearInterval(this.timeInterval);
        this.blinkDelimiter();
        this.isDelimShown = true;
      }

      if (this.stopwatchState.isStarted == storedIsStarted &&
          storedWindowCount == 1 && !storedIsStarted) {
        this.timeInterval = this.incrementTime();
        this.blinkInterval = this.blinkDelimiter();
      }

      if (e.timeStamps) {
        if (JSON.parse(e.timeStamps).length !== this.timeStamps.length) {
          this.timeStamps = JSON.parse(e.timeStamps);
        }
      }
    }
  }

  // Method that checks storage on component init.
  checkStorageOnInit() {
    let storedTime = this.storageService.getPropertyValue('time');
    let storedIsStarted = this.storageService.getPropertyValue('isStarted');
    let storedTimeStamps = this.storageService.getPropertyValue('timeStamps');
    let storedTrueTime = this.storageService.getPropertyValue('syncTime');

    let currentTime = Date.parse(new Date().toISOString());
    let elapsedTime = currentTime - storedTrueTime;

    if (storedTime !== null) {
      if (!this.stopwatchState.isTimeEqual(storedTime)) {
        this.stopwatchState.milliseconds = storedTime.milliseconds;
        this.stopwatchState.seconds = storedTime.seconds;
        this.stopwatchState.minutes = storedTime.minutes;
        console.log(storedIsStarted);
        this.stopwatchState.isStarted = storedIsStarted;
      }
      if (this.stopwatchState.isStarted) {
        let currentTime = Date.parse(new Date().toISOString());
        let elapsedTime = currentTime - storedTrueTime;
        console.log(elapsedTime);
        if (elapsedTime > 1000) {
          this.convertStoredTime(elapsedTime);
          this.timeInterval = this.incrementTime();
          this.blinkInterval = this.blinkDelimiter();
          this.storageService.savePropertyValue('isStarted', true);
        }
      }
      console.log(this.stopwatchState.isStarted);
      if (this.stopwatchState.isStarted) {
        this.blinkInterval = this.blinkDelimiter();
      }
      if (storedTimeStamps !== undefined) {
        this.timeStamps = storedTimeStamps;
      }
    }
  }

  // Method that converts last stored timestamp and is used when the last
  // component was closed and opened after some time to restore the time.
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

  // Method saves current component time.
  saveTime() {
    let time = {
      milliseconds: this.stopwatchState.milliseconds,
      seconds: this.stopwatchState.seconds,
      minutes: this.stopwatchState.minutes
    };
    this.storageService.savePropertyValue('time', time);
  }

  // Method saves current "real world" time.
  saveCurrentTime() {
    let currentTime = new Date().toISOString();
    this.storageService.savePropertyValue('syncTime', Date.parse(currentTime));
  }

  // Method ensures delimiter blinking.
  blinkDelimiter() {
    if (this.stopwatchState.isStarted) {
      this.blinkInterval = clearInterval(this.blinkInterval);
      return setInterval(() => {
        if (this.isDelimShown) {
          this.isDelimShown = false;
        } else {
          this.isDelimShown = true;
        }
      }, 1000);
    } else if (!this.stopwatchState.isStarted) {
      this.blinkInterval = clearInterval(this.blinkInterval);
    }
  }

}
