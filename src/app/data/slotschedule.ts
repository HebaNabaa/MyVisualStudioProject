export class SlotSchedule {
  slot : string;
  days: string;
  time: string;

  constructor(slot: string, days: string, time: string){
    this.slot = slot;
    this.days = days;
    this.time = time;
  }
}
