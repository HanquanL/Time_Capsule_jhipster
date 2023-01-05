import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISubTimeCapsule, NewSubTimeCapsule } from '../sub-time-capsule.model';

export type PartialUpdateSubTimeCapsule = Partial<ISubTimeCapsule> & Pick<ISubTimeCapsule, 'id'>;

type RestOf<T extends ISubTimeCapsule | NewSubTimeCapsule> = Omit<T, 'createdate'> & {
  createdate?: string | null;
};

export type RestSubTimeCapsule = RestOf<ISubTimeCapsule>;

export type NewRestSubTimeCapsule = RestOf<NewSubTimeCapsule>;

export type PartialUpdateRestSubTimeCapsule = RestOf<PartialUpdateSubTimeCapsule>;

export type EntityResponseType = HttpResponse<ISubTimeCapsule>;
export type EntityArrayResponseType = HttpResponse<ISubTimeCapsule[]>;

@Injectable({ providedIn: 'root' })
export class SubTimeCapsuleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sub-time-capsules');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(subTimeCapsule: NewSubTimeCapsule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subTimeCapsule);
    return this.http
      .post<RestSubTimeCapsule>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(subTimeCapsule: ISubTimeCapsule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subTimeCapsule);
    return this.http
      .put<RestSubTimeCapsule>(`${this.resourceUrl}/${this.getSubTimeCapsuleIdentifier(subTimeCapsule)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(subTimeCapsule: PartialUpdateSubTimeCapsule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subTimeCapsule);
    return this.http
      .patch<RestSubTimeCapsule>(`${this.resourceUrl}/${this.getSubTimeCapsuleIdentifier(subTimeCapsule)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSubTimeCapsule>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSubTimeCapsule[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSubTimeCapsuleIdentifier(subTimeCapsule: Pick<ISubTimeCapsule, 'id'>): number {
    return subTimeCapsule.id;
  }

  compareSubTimeCapsule(o1: Pick<ISubTimeCapsule, 'id'> | null, o2: Pick<ISubTimeCapsule, 'id'> | null): boolean {
    return o1 && o2 ? this.getSubTimeCapsuleIdentifier(o1) === this.getSubTimeCapsuleIdentifier(o2) : o1 === o2;
  }

  addSubTimeCapsuleToCollectionIfMissing<Type extends Pick<ISubTimeCapsule, 'id'>>(
    subTimeCapsuleCollection: Type[],
    ...subTimeCapsulesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const subTimeCapsules: Type[] = subTimeCapsulesToCheck.filter(isPresent);
    if (subTimeCapsules.length > 0) {
      const subTimeCapsuleCollectionIdentifiers = subTimeCapsuleCollection.map(
        subTimeCapsuleItem => this.getSubTimeCapsuleIdentifier(subTimeCapsuleItem)!
      );
      const subTimeCapsulesToAdd = subTimeCapsules.filter(subTimeCapsuleItem => {
        const subTimeCapsuleIdentifier = this.getSubTimeCapsuleIdentifier(subTimeCapsuleItem);
        if (subTimeCapsuleCollectionIdentifiers.includes(subTimeCapsuleIdentifier)) {
          return false;
        }
        subTimeCapsuleCollectionIdentifiers.push(subTimeCapsuleIdentifier);
        return true;
      });
      return [...subTimeCapsulesToAdd, ...subTimeCapsuleCollection];
    }
    return subTimeCapsuleCollection;
  }

  protected convertDateFromClient<T extends ISubTimeCapsule | NewSubTimeCapsule | PartialUpdateSubTimeCapsule>(
    subTimeCapsule: T
  ): RestOf<T> {
    return {
      ...subTimeCapsule,
      createdate: subTimeCapsule.createdate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSubTimeCapsule: RestSubTimeCapsule): ISubTimeCapsule {
    return {
      ...restSubTimeCapsule,
      createdate: restSubTimeCapsule.createdate ? dayjs(restSubTimeCapsule.createdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSubTimeCapsule>): HttpResponse<ISubTimeCapsule> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSubTimeCapsule[]>): HttpResponse<ISubTimeCapsule[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
