import {v4 as uuid} from 'uuid';

export abstract class ScaleType {
    protected abstract mode: string;
    protected Id: string = uuid();
    abstract dateToIntervalLabel(labelDate: Date): string;

    abstract floorDate(date: Date): Date;

    ceilDate(date: Date): Date {
        const r: Date = this.dateByIndex(this.floorDate(date), 1);
        return r;
    }

    // dateByIndex(startDate: Date, index: number): Date {
    //   const r: Date = new Date(this.floorDate(startDate));
    //   r.setDate(startDate.getDate() + index);
    //   return r;
    // }

    abstract dateByIndex(startDate: Date, index: number): Date;

    abstract intervalsInBetween(date1: Date, date2: Date): number;

    getName(): string {
        return this.mode;
    };

    getID(): string{
        return this.Id;
    }

}