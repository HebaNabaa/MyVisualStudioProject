import { Injectable } from '@angular/core';
// Firebase Module API functions
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  push,
  DataSnapshot,
} from 'firebase/database';
import { initializeApp } from 'firebase/app';

// getDatabase: takes in your account and project info and returns an instance (an object) giving you access to db functions
// ref: identifies a location/path within this database (looks like a folder with folders in it)
// set: puts an object in the database
// get: gets an object from the database once (returns a promise resolving with DataSnapshot)
// update: modifies an existing object in the database
// remove: removes an object from the database
// push: Adds an object to a database list. Autogenerates the ID
// onValue: subscribes to changes in the database. Gets called everytime the changes happen with new data.
// child: gives you a reference to your children

// Firebase Service
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  db: any;

  constructor() {
    this.setupFirebase(); // How we pass account and project info
    this.db = getDatabase(); // this is how we get a db object to use to access all the others functions
  }
  setupFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyBsyz1qlBNRYE5lX-rWt81tp5l5Uf3XAFo",
      authDomain: "cyber-6940d.firebaseapp.com",
      databaseURL: "https://cyber-6940d-default-rtdb.firebaseio.com",
      projectId: "cyber-6940d",
      storageBucket: "cyber-6940d.firebasestorage.app",
      messagingSenderId: "498324611710",
      appId: "1:498324611710:web:eacc903fe555935ee12e2f",
      measurementId: "G-6NMZKDWR3S"
    };
    initializeApp(firebaseConfig);
  }

  // CRUD: Create, Retrieve, Update, Delete
  create(path: string, data: any): Promise<void>{ // Create
    return set(ref(this.db, path), data);
  }
  async retrieve(path: string, key: string): Promise<DataSnapshot>{
    return await get(ref(this.db, path+"/"+key));
  }
  update(path: string, key: string, data: any): Promise<void>{
    return update(ref(this.db, path + "/" + key), data);
  }
  delete(path: string, key: string): Promise<void>{
    return remove(ref(this.db, path+"/"+key));
  }

  // Lists
  // Add to List
  pushToList(path: string, data: any){
    return push(ref(this.db, path), data).key;
  }
  // Delete from list
  deleteFromList(path: string, key: string){
    this.delete(path, key);
  }
  // Get List Once
  async getList(path: string){
    const dblist = await get(ref(this.db, path));
    let locallist: any[] = [];
    dblist.forEach( (item: any) =>{locallist.push(item.val());});
    return locallist;
  }
  reset(){
    this.delete("","");
  }
  getDB(){
    return this.db;
  }
}

