import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-timestamp',
  templateUrl: './timestamp.component.html',
  styleUrls: ['./timestamp.component.css']
})
export class TimestampComponent implements OnInit {


  @Input() timeStamp;
  @Output() removeTimeStamp = new EventEmitter<string>();

  isVisible = false;
  @HostListener('mouseenter') onEnter() {
    this.isVisible = true;
  }

  @HostListener('mouseleave') onLeave() {
    this.isVisible = false;
  }

  onRemove(stampId) {
    this.removeTimeStamp.emit(stampId);
  }

  constructor() { }

  ngOnInit() {
  }

}
