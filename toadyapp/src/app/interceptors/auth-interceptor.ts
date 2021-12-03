import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClientJsonpModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageService } from '../message.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private messageService: MessageService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const idToken = localStorage.getItem("id_token");
        
        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization", idToken)
            });

            const stringIdToken = JSON.stringify(cloned)
            this.messageService.add(`Intercept: ${idToken}`)

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}