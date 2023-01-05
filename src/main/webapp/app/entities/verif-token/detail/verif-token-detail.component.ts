import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVerifToken } from '../verif-token.model';

@Component({
  selector: 'jhi-verif-token-detail',
  templateUrl: './verif-token-detail.component.html',
})
export class VerifTokenDetailComponent implements OnInit {
  verifToken: IVerifToken | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ verifToken }) => {
      this.verifToken = verifToken;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
