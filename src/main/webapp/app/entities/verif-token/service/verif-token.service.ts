import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVerifToken, NewVerifToken } from '../verif-token.model';

export type PartialUpdateVerifToken = Partial<IVerifToken> & Pick<IVerifToken, 'id'>;

type RestOf<T extends IVerifToken | NewVerifToken> = Omit<T, 'expirydate'> & {
  expirydate?: string | null;
};

export type RestVerifToken = RestOf<IVerifToken>;

export type NewRestVerifToken = RestOf<NewVerifToken>;

export type PartialUpdateRestVerifToken = RestOf<PartialUpdateVerifToken>;

export type EntityResponseType = HttpResponse<IVerifToken>;
export type EntityArrayResponseType = HttpResponse<IVerifToken[]>;

@Injectable({ providedIn: 'root' })
export class VerifTokenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/verif-tokens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(verifToken: NewVerifToken): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(verifToken);
    return this.http
      .post<RestVerifToken>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(verifToken: IVerifToken): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(verifToken);
    return this.http
      .put<RestVerifToken>(`${this.resourceUrl}/${this.getVerifTokenIdentifier(verifToken)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(verifToken: PartialUpdateVerifToken): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(verifToken);
    return this.http
      .patch<RestVerifToken>(`${this.resourceUrl}/${this.getVerifTokenIdentifier(verifToken)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVerifToken>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVerifToken[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVerifTokenIdentifier(verifToken: Pick<IVerifToken, 'id'>): number {
    return verifToken.id;
  }

  compareVerifToken(o1: Pick<IVerifToken, 'id'> | null, o2: Pick<IVerifToken, 'id'> | null): boolean {
    return o1 && o2 ? this.getVerifTokenIdentifier(o1) === this.getVerifTokenIdentifier(o2) : o1 === o2;
  }

  addVerifTokenToCollectionIfMissing<Type extends Pick<IVerifToken, 'id'>>(
    verifTokenCollection: Type[],
    ...verifTokensToCheck: (Type | null | undefined)[]
  ): Type[] {
    const verifTokens: Type[] = verifTokensToCheck.filter(isPresent);
    if (verifTokens.length > 0) {
      const verifTokenCollectionIdentifiers = verifTokenCollection.map(verifTokenItem => this.getVerifTokenIdentifier(verifTokenItem)!);
      const verifTokensToAdd = verifTokens.filter(verifTokenItem => {
        const verifTokenIdentifier = this.getVerifTokenIdentifier(verifTokenItem);
        if (verifTokenCollectionIdentifiers.includes(verifTokenIdentifier)) {
          return false;
        }
        verifTokenCollectionIdentifiers.push(verifTokenIdentifier);
        return true;
      });
      return [...verifTokensToAdd, ...verifTokenCollection];
    }
    return verifTokenCollection;
  }

  protected convertDateFromClient<T extends IVerifToken | NewVerifToken | PartialUpdateVerifToken>(verifToken: T): RestOf<T> {
    return {
      ...verifToken,
      expirydate: verifToken.expirydate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVerifToken: RestVerifToken): IVerifToken {
    return {
      ...restVerifToken,
      expirydate: restVerifToken.expirydate ? dayjs(restVerifToken.expirydate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVerifToken>): HttpResponse<IVerifToken> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVerifToken[]>): HttpResponse<IVerifToken[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
