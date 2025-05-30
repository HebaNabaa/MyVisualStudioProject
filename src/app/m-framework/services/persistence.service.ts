import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, set, onValue, get, push } from 'firebase/database';

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
  if(type === 'local'){
    this.locallist?.push(item);
    localStorage.setItem("local", JSON.stringify(this.locallist));
  } else if (type === 'remote'){
    const itemKey = item.s;  
    const dataRef = ref(this.db, 'items/' + itemKey);

    set(dataRef, item).then(() => {
      item.id = itemKey; 
      this.remotelist.push(item);
      console.log("Added to Firebase:", itemKey);
      alert("Item Added");
    });
  }
}
remove(item: any, type: string) {
 if (type === 'remote') {
    const itemKey = item.s;  
    const dataRef = ref(this.db, 'items/' + itemKey);

   remove(dataRef).then(() => {
      const index = this.remotelist.findIndex(s => s.s === item.s);
      if (index !== -1) {
        this.remotelist.splice(index, 1);
      }
      console.log("Removed from Firebase:", itemKey);
      alert("Item Removed");
    });
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
