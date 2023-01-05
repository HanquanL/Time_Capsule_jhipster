import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISubTimeCapsule } from '../sub-time-capsule.model';

@Component({
  selector: 'jhi-sub-time-capsule-detail',
  templateUrl: './sub-time-capsule-detail.component.html',
})
export class SubTimeCapsuleDetailComponent implements OnInit {
  subTimeCapsule: ISubTimeCapsule | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subTimeCapsule }) => {
      this.subTimeCapsule = subTimeCapsule;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
