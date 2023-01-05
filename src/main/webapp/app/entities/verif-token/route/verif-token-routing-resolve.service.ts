import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVerifToken } from '../verif-token.model';
import { VerifTokenService } from '../service/verif-token.service';

@Injectable({ providedIn: 'root' })
export class VerifTokenRoutingResolveService implements Resolve<IVerifToken | null> {
  constructor(protected service: VerifTokenService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVerifToken | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((verifToken: HttpResponse<IVerifToken>) => {
          if (verifToken.body) {
            return of(verifToken.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
