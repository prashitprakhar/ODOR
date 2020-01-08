import { Injectable } from '@angular/core';
import { NetworkStatus, Plugins } from '@capacitor/core';
import { from } from "rxjs";
import { map } from 'rxjs/operators';
import { MessageService } from './message.service';

const { Network } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: NetworkStatus;

  constructor(private messageService: MessageService) { }

   checkNetworkStatus() {
      return from(Network.getStatus());
      // .pipe(
      //   map(networkData => {
      //     this.status = networkData;
      //   }
      //   )
      // )
      // .subscribe(networkData => {
      //   console.log("Network Status Data ********",networkData);
      // })
  }
}
