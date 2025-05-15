import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove, set } from 'firebase/database';


@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  private db: any;
  private itemRef: any;

  locallist: any[] | null
  remotelist: any[];

  constructor() {
    this.remotelist = [];
    let myList : string | null =  localStorage.getItem("local")
    this.locallist = myList != null ?  JSON.parse(myList) : [];
    const firebaseApp = initializeApp(environment);
    this.db = getDatabase(firebaseApp);
    this.itemRef = ref(this.db,'items');
    this.listen();
  }
  listen(){
    onValue(this.itemRef,(snapshot)=>{
      const data = snapshot.val();
      this.remotelist = data ? Object.keys(data).map( id => ({id, ...data[id]})):[];
    });

  }
  add(item: any){
   
      this.locallist?.push(item);
      localStorage.setItem("local",JSON.stringify(this.locallist));
      //console.log(this.locallist)
    }
       getLocalList(){
    return this.locallist;
  }
   getRemoteList(){
    return this.remotelist;
  }
  }

