import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private subject = new Subject<any>();
  private networkSubject = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next({ text: message });
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    sendNetworkStatusMessage(message) {
      this.networkSubject.next({networkMessage : message});
    }

    clearNetworkStatusMessage() {
      this.networkSubject.next();
    }

    getNetworkStatusMessage(): Observable<any> {
      return this.networkSubject.asObservable();
    }
}
