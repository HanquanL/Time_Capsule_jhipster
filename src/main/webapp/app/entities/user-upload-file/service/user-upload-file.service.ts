import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserUploadFile, NewUserUploadFile } from '../user-upload-file.model';

export type PartialUpdateUserUploadFile = Partial<IUserUploadFile> & Pick<IUserUploadFile, 'id'>;

export type EntityResponseType = HttpResponse<IUserUploadFile>;
export type EntityArrayResponseType = HttpResponse<IUserUploadFile[]>;

@Injectable({ providedIn: 'root' })
export class UserUploadFileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-upload-files');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userUploadFile: NewUserUploadFile): Observable<EntityResponseType> {
    return this.http.post<IUserUploadFile>(this.resourceUrl, userUploadFile, { observe: 'response' });
  }

  update(userUploadFile: IUserUploadFile): Observable<EntityResponseType> {
    return this.http.put<IUserUploadFile>(`${this.resourceUrl}/${this.getUserUploadFileIdentifier(userUploadFile)}`, userUploadFile, {
      observe: 'response',
    });
  }

  partialUpdate(userUploadFile: PartialUpdateUserUploadFile): Observable<EntityResponseType> {
    return this.http.patch<IUserUploadFile>(`${this.resourceUrl}/${this.getUserUploadFileIdentifier(userUploadFile)}`, userUploadFile, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserUploadFile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserUploadFile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserUploadFileIdentifier(userUploadFile: Pick<IUserUploadFile, 'id'>): number {
    return userUploadFile.id;
  }

  compareUserUploadFile(o1: Pick<IUserUploadFile, 'id'> | null, o2: Pick<IUserUploadFile, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserUploadFileIdentifier(o1) === this.getUserUploadFileIdentifier(o2) : o1 === o2;
  }

  addUserUploadFileToCollectionIfMissing<Type extends Pick<IUserUploadFile, 'id'>>(
    userUploadFileCollection: Type[],
    ...userUploadFilesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userUploadFiles: Type[] = userUploadFilesToCheck.filter(isPresent);
    if (userUploadFiles.length > 0) {
      const userUploadFileCollectionIdentifiers = userUploadFileCollection.map(
        userUploadFileItem => this.getUserUploadFileIdentifier(userUploadFileItem)!
      );
      const userUploadFilesToAdd = userUploadFiles.filter(userUploadFileItem => {
        const userUploadFileIdentifier = this.getUserUploadFileIdentifier(userUploadFileItem);
        if (userUploadFileCollectionIdentifiers.includes(userUploadFileIdentifier)) {
          return false;
        }
        userUploadFileCollectionIdentifiers.push(userUploadFileIdentifier);
        return true;
      });
      return [...userUploadFilesToAdd, ...userUploadFileCollection];
    }
    return userUploadFileCollection;
  }
}
