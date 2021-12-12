import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { Router } from '@angular/router';

import { User } from './user';
import { DisplayTask } from './displaytask';
import { Task } from './task'
import { MessageService } from './message.service';
import { environment } from '../environments/environment';
import { JWTAuthService } from './jwtauth.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private restUrl = 'http://localhost:8080/users/a';
  private protectedRoute = 'http://localhost:8080/protected';
  private displayTaskURL = 'http://localhost:8080/tasks/';
  private taskURL = 'http://localhost:8080/tasks/t/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private jwtAuthService: JWTAuthService
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.restUrl)
        .pipe(
          tap(
            event => {
              this.log('Fetched users')
            },
            error => {
              this.handleErrorResponse(error);
            }
          ),
          catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  getProtectedRoute(): Observable<any> {
    // Currently not working correctly
    return this.http.get<any>(this.protectedRoute)
      .pipe(
        tap(
          event => {
            this.log("Fetched protected route")
          },
          error => {
            this.handleErrorResponse(error);
          }
        ),
        catchError(this.handleError<any>('getProtectedRoute', []))
      )
  }

  getDisplayTasks(userId: string): Observable<DisplayTask[]> {
    return this.http.get<DisplayTask[]>(this.displayTaskURL + userId)
      .pipe(
        tap(
          event => {
            this.log(`Fetched display tasks for user: ${userId}`);
          },
          error => {
            this.handleErrorResponse(error);
          }
        ),
        catchError(this.handleError<DisplayTask[]>('getDisplayTasks', []))
      )
  }

  getTaskFullDetails(taskId: string): Observable<Task> {
    return this.http.get<Task>(this.taskURL + taskId)
      .pipe(
        tap(
          event => {
            this.log(`Fetched task details for task ID: ${taskId}`);
          },
          error => {
            this.handleErrorResponse(error);
          }
        ),
        catchError(this.handleError<Task>('getTaskFullDetails'))
      )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${JSON.stringify(error)}`);

      return of(result as T);
    }
  }

  private handleErrorResponse(err: any) {
    this.messageService.add('Error found!')
    if (err instanceof HttpErrorResponse) {
      if ((err.status >= 400 && err.status < 500) || err.statusText === 'Unauthorized') {
        this.jwtAuthService.logout()
        this.router.navigate(['/login'])
      }
    }
  }

  private log(msg: string): void {
    this.messageService.add(msg);
  }
}
