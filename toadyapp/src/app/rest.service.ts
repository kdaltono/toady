import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

import { User } from './user';
import { MessageService } from './message.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private restUrl = 'http://localhost:8080/users/a';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.restUrl)
        .pipe(
          tap(_ => this.log('Fetched users')),
          catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${JSON.stringify(error)}`);

      return of(result as T);
    }
  }

  private log(msg: string): void {
    this.messageService.add(msg);
  }
}
