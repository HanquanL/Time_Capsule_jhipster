import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVote, NewVote } from '../vote.model';

export type PartialUpdateVote = Partial<IVote> & Pick<IVote, 'id'>;

export type EntityResponseType = HttpResponse<IVote>;
export type EntityArrayResponseType = HttpResponse<IVote[]>;

@Injectable({ providedIn: 'root' })
export class VoteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/votes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vote: NewVote): Observable<EntityResponseType> {
    return this.http.post<IVote>(this.resourceUrl, vote, { observe: 'response' });
  }

  update(vote: IVote): Observable<EntityResponseType> {
    return this.http.put<IVote>(`${this.resourceUrl}/${this.getVoteIdentifier(vote)}`, vote, { observe: 'response' });
  }

  partialUpdate(vote: PartialUpdateVote): Observable<EntityResponseType> {
    return this.http.patch<IVote>(`${this.resourceUrl}/${this.getVoteIdentifier(vote)}`, vote, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVote>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVote[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVoteIdentifier(vote: Pick<IVote, 'id'>): number {
    return vote.id;
  }

  compareVote(o1: Pick<IVote, 'id'> | null, o2: Pick<IVote, 'id'> | null): boolean {
    return o1 && o2 ? this.getVoteIdentifier(o1) === this.getVoteIdentifier(o2) : o1 === o2;
  }

  addVoteToCollectionIfMissing<Type extends Pick<IVote, 'id'>>(
    voteCollection: Type[],
    ...votesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const votes: Type[] = votesToCheck.filter(isPresent);
    if (votes.length > 0) {
      const voteCollectionIdentifiers = voteCollection.map(voteItem => this.getVoteIdentifier(voteItem)!);
      const votesToAdd = votes.filter(voteItem => {
        const voteIdentifier = this.getVoteIdentifier(voteItem);
        if (voteCollectionIdentifiers.includes(voteIdentifier)) {
          return false;
        }
        voteCollectionIdentifiers.push(voteIdentifier);
        return true;
      });
      return [...votesToAdd, ...voteCollection];
    }
    return voteCollection;
  }
}
