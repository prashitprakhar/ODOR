import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
// import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private subject = new Subject<any>();
  private networkSubject = new Subject<any>();
  private cartEmptyOnOrderSuccess = new Subject<any>();

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

    clearCartStatusAfterOrderPlaced() {
      this.cartEmptyOnOrderSuccess.next();
    }

    sendCartStatusMessage(message) {
      this.cartEmptyOnOrderSuccess.next({cartStatus : message});
    }

    getCartEmptyAfterOrderPlacedStatus(): Observable<any> {
      return this.cartEmptyOnOrderSuccess.asObservable();
      // .pipe(take(1));
    }
}
