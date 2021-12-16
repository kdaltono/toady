import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageService } from '../message.service';

@Injectable()
export class RespInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(res: HttpResponse<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(res);
    }
}