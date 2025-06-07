import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  locallist: any[];
  scheduledlist: any[];

  constructor() {
    this.scheduledlist = [];
    let myList: string | null = localStorage.getItem('local');
    this.locallist = myList ? JSON.parse(myList) : [];
  }

  getList(): any {

    localStorage.setItem('local', JSON.stringify(this.locallist));
    return this.locallist;
  }

  setList(list: any[]): void {
    this.locallist = list;
    localStorage.setItem('local', JSON.stringify(this.locallist));
  }

    getallScheduledList(): any[]{
    const scheduled = localStorage.getItem('local');
    if (scheduled){
      return this.scheduledlist = JSON.parse(scheduled);
    }
    return this.scheduledlist;
  }
}

