import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, set, onValue } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  private db: any;
  private itemRef : any;

  locallist : any[] | null;
  remotelist: any[];

  constructor() {
    this.remotelist = [];
    let myList : string | null = localStorage.getItem("local");
    this.locallist = myList != null ? JSON.parse(myList) : [];
    const firebaseApp = initializeApp(environment);
    this.db = getDatabase(firebaseApp);
    this.itemRef = ref(this.db, 'items');
    this.listen();
  }

  listen(){
    onValue(ref(this.db),(snapshot)=>{
      const data = snapshot.val();
      this.remotelist = data ? Object.keys(data).map( id => ({id, ...data[id]})):[];
    });
  }

  add(item: any, type: string){
    if(type == 'local'){
      this.locallist?.push(item);
      localStorage.setItem("local",JSON.stringify(this.locallist));
    }else if (type == 'remote'){
      set(ref(this.db,`items/${item.id}`), item).then(()=>{
        console.log("Added to Firebase");
        alert("Item Added");
      });
    }
  }

  remove(id: string, type: string){
    if(type == 'local'){
      this.locallist?.splice(this.locallist.findIndex((item)=>{
        return item.id == id;
      }),1);
      localStorage.setItem("local", JSON.stringify(this.locallist));
    }else if (type == 'remote'){
      this.remotelist?.splice(this.remotelist.findIndex((item)=>{
        return item.id == id;
      }),1);
      remove(ref(this.db,`items/${id}`)).then(()=>{
        console.log("Added to Firebase");
        alert("Item Removed");
      })
    }
  }

  getLocalList(){
    return this.locallist;
  }

  getRemoteList(){
    return this.remotelist
  }

  saveSchedule(data:any): Promise<void>{
    const dbRef = ref(this.db,`versions/${data.id}`);
    return set(dbRef,data);
  }
}
