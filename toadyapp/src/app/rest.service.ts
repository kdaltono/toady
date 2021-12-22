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
import { SimplifiedUser } from './simplifieduser';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private restUrl = 'http://localhost:8080/users/a';
  private protectedRoute = 'http://localhost:8080/protected';
  private displayTaskURL = 'http://localhost:8080/tasks/';
  private taskURL = 'http://localhost:8080/tasks/t/';
  private insertNewTaskURL = 'http://localhost:8080/tasks/i';
  private commentsURL = 'http://localhost:8080/comm/';
  private insertCommentURL = 'http://localhost:8080/comm/add';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private jwtAuthService: JWTAuthService
  ) { }

  getUsers(): Observable<SimplifiedUser[]> {
    return this.http.get<SimplifiedUser[]>(this.restUrl)
        .pipe(
          tap(
            event => {
              this.log('Fetched users')
            },
            error => {
              this.handleErrorResponse(error);
            }
          ),
          catchError(this.handleError<SimplifiedUser[]>('getUsers', []))
    );
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

  getTaskComments(taskId: string): Observable<any> {
    // TODO: Add comments url and query
    return this.http.get<Comment>(this.commentsURL + taskId)
      .pipe(
        tap(
          event => {
            this.log(`Fetched comments for task ID: ${taskId}`)
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<Comment>('getTaskComments'))
      )
  }

  insertNewTask(taskTitle: string, taskDescription: string, assignedUsers: SimplifiedUser[]) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      task_title: taskTitle,
      task_desc: taskDescription,
      assigned_users: assignedUsers
    }

    this.http.post(this.insertNewTaskURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add('New Task added successfully')
        this.router.navigate(['/home'])
      }
    )
  }

  async insertNewComment(taskId: string, userId: string, commentText: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      task_id: taskId,
      user_id: userId,
      comment_text: commentText
    }

    this.http.post(this.insertCommentURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add('New comment inserted successfully')
      }
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
      if ((err.status >= 400 && err.status < 500) && err.statusText === 'Unauthorized') {
        this.jwtAuthService.logout()
        this.router.navigate(['/login'])
      }
    }
  }

  private log(msg: string): void {
    this.messageService.add(msg);
  }
}
