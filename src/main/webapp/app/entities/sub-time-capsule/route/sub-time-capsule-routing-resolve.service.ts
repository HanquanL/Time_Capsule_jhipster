import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISubTimeCapsule } from '../sub-time-capsule.model';
import { SubTimeCapsuleService } from '../service/sub-time-capsule.service';

@Injectable({ providedIn: 'root' })
export class SubTimeCapsuleRoutingResolveService implements Resolve<ISubTimeCapsule | null> {
  constructor(protected service: SubTimeCapsuleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISubTimeCapsule | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((subTimeCapsule: HttpResponse<ISubTimeCapsule>) => {
          if (subTimeCapsule.body) {
            return of(subTimeCapsule.body);
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
