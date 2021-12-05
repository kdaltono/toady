import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

import { User } from './user';
import { DisplayTask } from './displaytask';
import { MessageService } from './message.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private restUrl = 'http://localhost:8080/users/a';
  private protectedRoute = 'http://localhost:8080/protected';
  private displayTaskURL = 'http://localhost:8080/tasks/';

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

  getProtectedRoute(): Observable<any> {
    // Currently not working correctly
    return this.http.get<any>(this.protectedRoute)
      .pipe(
        tap(_ => this.log("Fetched protected route")),
        catchError(this.handleError<any>('getProtectedRoute', []))
      )
  }

  getDisplayTasks(userId: string): Observable<DisplayTask[]> {
    return this.http.get<DisplayTask[]>(this.displayTaskURL + userId)
      .pipe(
        tap(_ => this.log(`Fetched display tasks for user: ${userId}`)),
        catchError(this.handleError<DisplayTask[]>('getDisplayTasks', []))
      )
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
