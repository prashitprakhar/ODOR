import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AngularFirestoreDbService {

  constructor(private db: AngularFirestore) { }

  addNewShop() {
    return this.db.collection('shops').valueChanges();
  }

}
