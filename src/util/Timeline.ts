import { ScaleMode } from "./ScaleMode";

export class Timeline {
  private _scaleMode: ScaleMode;
  private _startDate: Date;
  private _endDate: Date;


  constructor(scaleMode: ScaleMode, startDate: Date, endDate: Date) {
    this._scaleMode = scaleMode;
    this._startDate = scaleMode.parent.floorDate(startDate);
    this._endDate = scaleMode.parent.ceilDate(endDate);
  }

  public deltaTime(): number {
    return this._endDate.valueOf() - this._startDate.valueOf();
  }

  public positionOnTimeline(date: Date): number {
    return ((date.valueOf() - this._startDate.valueOf()) / this.deltaTime()) * 100;
  }

  public lengthOnTimeLine(startDate: Date, endDate: Date): number {
    return ((endDate.valueOf() - startDate.valueOf()) / this.deltaTime()) * 100;
  }

  public scalesOnTimeLine(): number {
    let counter: number = 0;
    while (this._scaleMode.parent.dateByIndex(this._startDate, counter).valueOf() < this._endDate.valueOf()) {
      counter++;
    }
    return counter;
  }

  get scaleMode(): ScaleMode {
    return this._scaleMode;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }
}