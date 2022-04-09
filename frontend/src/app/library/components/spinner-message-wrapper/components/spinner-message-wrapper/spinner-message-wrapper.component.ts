import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'spinner-message-wrapper',
  templateUrl: './spinner-message-wrapper.component.html',
  styleUrls: ['./spinner-message-wrapper.component.css']
})
export class SpinnerMessageWrapperComponent implements OnInit {
  @Input() hasData = false;
  @Input() loading = false;
  @Input() message = 'No data';

  constructor() { }

  ngOnInit(): void {
  }
}
