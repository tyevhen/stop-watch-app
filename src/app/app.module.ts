import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { StorageHandlerService } from './storage-handler.service';
import { TwoDigitPipe } from './two-digit.pipe';
import { TimestampComponent } from './timestamp/timestamp.component';


@NgModule({
  declarations: [
    AppComponent,
    StopwatchComponent,
    TwoDigitPipe,
    TimestampComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    StorageHandlerService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
