import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'audate-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  constructor() {}
  steps = ['hello', 'world'];

  ngOnInit(): void {}
}
