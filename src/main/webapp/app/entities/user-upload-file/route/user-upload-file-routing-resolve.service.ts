import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserUploadFile } from '../user-upload-file.model';
import { UserUploadFileService } from '../service/user-upload-file.service';

@Injectable({ providedIn: 'root' })
export class UserUploadFileRoutingResolveService implements Resolve<IUserUploadFile | null> {
  constructor(protected service: UserUploadFileService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserUploadFile | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userUploadFile: HttpResponse<IUserUploadFile>) => {
          if (userUploadFile.body) {
            return of(userUploadFile.body);
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
