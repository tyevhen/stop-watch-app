import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { StorageHandlerService } from './storage-handler.service';
import { TwoDigitPipe } from './two-digit.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StopwatchComponent,
    TwoDigitPipe,
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
