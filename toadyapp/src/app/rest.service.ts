import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { Router } from '@angular/router';

import { User } from './user';
import { DisplayTask } from './displaytask';
import { Pad } from './pad';
import { Pond } from './pond';
import { DisplayUser } from './displayuser';
import { Task } from './task'
import { MessageService } from './message.service';
import { environment } from '../environments/environment';
import { JWTAuthService } from './jwtauth.service';
import { SimplifiedUser } from './simplifieduser';
import { TaskStatus } from './task_status';
import { UserToTask } from './user_to_task';
import { assign, head } from 'underscore';

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
  private deleteCommentURL = 'http://localhost:8080/comm/del';
  private taskStatusURL = 'http://localhost:8080/status';
  private updateStatusURL = 'http://localhost:8080/tasks/status/u';
  private insertNewUserURL = 'http://localhost:8080/users/register';
  private getAssignedUsersURL = 'http://localhost:8080/tasks/users/a/';
  private unassignUserURL = 'http://localhost:8080/assign/d';
  private assignUserURL = 'http://localhost:8080/assign/a';
  private getUserAssignedPondsURL = 'http://localhost:8080/pond/u/';
  private getPondAssignedUsersURL = 'http://localhost:8080/pond/p/';
  private getPondDataURL = 'http://localhost:8080/pond/';
  private getPadTasksURL = 'http://localhost:8080/pad/';
  private getPondPadDataURL = 'http://localhost:8080/pond/pads/';
  private getContinuousTasksURL = 'http://localhost:8080/pond/tasks/';
  private updatePadReviewTextURL = 'http://localhost:8080/pad/review';
  private updateStartAndEndDateURL = 'http://localhost:8080/pad/dates';
  private updatePadOrderValuesURL = 'http://localhost:8080/pad/orders';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private jwtAuthService: JWTAuthService
  ) { }

  getUsers(): Observable<DisplayUser[]> {
    return this.http.get<DisplayUser[]>(this.restUrl)
        .pipe(
          tap(
            event => {
              this.log('Fetched users')
            },
            error => {
              this.handleErrorResponse(error);
            }
          ),
          catchError(this.handleError<DisplayUser[]>('getUsers', []))
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

  getTaskStatus(): Observable<TaskStatus[]> {
    return this.http.get<TaskStatus[]>(this.taskStatusURL)
      .pipe(
        tap(
          event => {
            this.log('Fetched task statuses')
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<TaskStatus[]>('getTaskStatus'))
      )
  }

  getTaskComments(taskId: string): Observable<any> {
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

  getContinuousTasks(pondId: string): Observable<DisplayTask[]> {
    return this.http.get<DisplayTask[]>(this.getContinuousTasksURL + pondId)
      .pipe(
        tap(
          event => {
            this.log(`Fetched comments for pond ID: ${pondId}`)
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<DisplayTask[]>('getContinuousTasks'))
      )
  }

  insertNewTask(taskTitle: string, taskDescription: string, assignedUsers: SimplifiedUser[], 
                padId: string, pondId: string, isContinuous: boolean) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      task_title: taskTitle,
      task_desc: taskDescription,
      assigned_users: assignedUsers,
      pad_id: padId,
      pond_id: pondId,
      is_continuous: isContinuous
    };

    this.http.post(this.insertNewTaskURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add('New Task added successfully')
        this.router.navigate(['/home'])
      },
      error => {
        this.messageService.add('Error: ' + JSON.stringify(error));
      }
    )
  }

  insertNewComment(taskId: string, userId: string, commentText: string) {
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

  updatePadStartAndEndDates(start_dstamp: string, end_dstamp: string, pad_id: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      start_dstamp: start_dstamp,
      end_dstamp: end_dstamp,
      pad_id: pad_id
    };

    this.http.post(this.updateStartAndEndDateURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add('Updated start and end dates successfully')
      }
    )
  }

  updatePadReviewText(pad_id: string, review_text: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      pad_id: pad_id,
      review_text: review_text
    }

    this.http.post(this.updatePadReviewTextURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add("Pad Review Text updated successfully");
      }
    );
  }

  updatePadOrderValues(padOrderValues: any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      padOrderValues: padOrderValues
    }

    this.http.post(this.updatePadOrderValuesURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add("Updated Pad Order Values successfully");
      }
    )
  }

  deleteComment(commentId: string, commentText: string, userId: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      comment_id: commentId,
      comment_text: commentText,
      user_id: userId
    }

    this.http.delete(this.deleteCommentURL, {headers: headers, body: reqObject}).subscribe(
      () => {
        this.messageService.add('Comment deleted successfully')
      }
    )
  }

  updateTaskStatus(taskId: string, statusId: string): void {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      task_id: taskId,
      status_id: statusId
    }

    this.http.put<any>(this.updateStatusURL, reqObject, { headers }).subscribe(
      () => {
        this.messageService.add('Task Status update successful');
      }
    )
  }

  getAssignedUsersForTask(task_id: string): Observable<DisplayUser[]> {
    const url = this.getAssignedUsersURL + task_id;
    return this.http.get<DisplayUser[]>(url)
      .pipe(
        tap (
          event => {
            this.log(`Fetched assigned users for task ID: ${task_id}`)
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<DisplayUser[]>('getAssignedUsersForTask'))
      )
  }

  getUserAssignedPonds(user_id: string): Observable<Pond[]> {
    const url = this.getUserAssignedPondsURL + user_id;
    return this.http.get<Pond[]>(url)
      .pipe(
        tap (
          event => {
            this.log(`Fetched ponds for user ID: ${user_id}`)
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<Pond[]>('getUserAssignedPonds'))
      )
  }

  getPondData(pond_id: string): Observable<Pond> {
    const url = this.getPondDataURL + pond_id;
    return this.http.get<Pond>(url)
      .pipe(
        tap (
          event => {
            this.log(`Fetched ponds data for pond ID: ${pond_id}`)
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<Pond>('getPondData'))
      )
  }

  getPondAssignedUsers(pond_id: string): Observable<DisplayUser[]> {
    const url = this.getPondAssignedUsersURL + pond_id;
    return this.http.get<DisplayUser[]>(url)
      .pipe(
        tap (
          event => {
            this.log(`Fetched users for pond ID: ${pond_id}`)
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<DisplayUser[]>('getPondAssignedUsers'))
      )
  }

  getPondPadData(pondId: string): Observable<Pad[]> {
    const url = this.getPondPadDataURL + pondId
    return this.http.get<Pad[]>(url)
      .pipe(
        tap (
          event => {
            this.log(`Fetched pads for Pond ID: ${pondId}`)
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<Pad[]>('getPondPadData'))
      )
  }

  getPadTasks(pad_id: string): Observable<DisplayTask[]> {
    const url = this.getPadTasksURL + pad_id;
    return this.http.get<DisplayTask[]>(url)
      .pipe(
        tap (
          event => {
            this.log(`Fetched tasks for pad ID: ${pad_id}`)
          },
          error => {
            this.handleErrorResponse(error)
          }
        ),
        catchError(this.handleError<DisplayTask[]>('getPadTasks'))
      )
  }

  insertNewUser(username: string, firstname: string, lastname: string, password: string): void {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      password: password
    };

    this.http.post(this.insertNewUserURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add("New user inserted successfully")
        this.router.navigate(['/login'])
      },
      error => {
        this.messageService.add("Error: " + JSON.stringify(error))
      }
    )
  }

  assignUsers(assignedUsers: UserToTask[]): void {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      assignedUsers: assignedUsers
    }

    this.http.post(this.assignUserURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add("Assigned users successfully");
      },
      error => {
        this.messageService.add("Error assigning users: " + JSON.stringify(error));
      }
    )
  }

  unassignUsers(unassignedUsers: UserToTask[]): void {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      unassignedUsers: unassignedUsers
    }

    this.http.post(this.unassignUserURL, reqObject, { headers: headers }).subscribe(
      () => {
        this.messageService.add("Unassigned users successfully")
      },
      error => {
        this.messageService.add("Error unassigning users: " + JSON.stringify(error));
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
