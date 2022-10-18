export abstract class ScaleType {
  protected abstract mode: string;

  abstract dateToIntervalLabel(labelDate: Date): string;

  abstract floorDate(date: Date): Date;

  ceilDate(date: Date): Date {
    const r: Date = this.dateByIndex(this.floorDate(date), 1);
    r.setMinutes(-1)
    return r;
  }

  abstract dateByIndex(startDate: Date, index: number): Date;

  getName(): string {
    return this.mode;
  };
}