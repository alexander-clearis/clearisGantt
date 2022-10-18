import { Day } from "./Day";
import { Month } from "./Month";
import { ScaleType } from "./ScaleType";

export class DayScale extends ScaleType {
  mode = "DAY OF THE WEEK";

  dateToIntervalLabel(labelDate: Date): string {
    return Day[this.floorDate(labelDate).getDay()];
  }

  floorDate(date: Date): Date {
    const r: Date = new Date(date);
    r.setHours(0, 0, 0, 0);
    return r;
  }

  ceilDate(date: Date): Date {
    const r: Date = new Date(date);
    r.setHours(23, 59, 9, 0);
    return r;
  }

  dateByIndex(startDate: Date, index: number): Date {
    const r: Date = new Date(this.floorDate(startDate));
    r.setDate(startDate.getDate() + index);
    return r;
  }

}

export class WeekScale extends ScaleType {
  readonly mode = "WEEK";

  private getWeekNr(date: Date): number {
    const tdt: Date = new Date(date);
    const dayn: number = (date.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt.valueOf()) / 604800000);
  }

  dateByIndex(startDate: Date, index: number): Date {
    const r: Date = this.floorDate(startDate);
    r.setDate(startDate.getDate() + (index * 7));
    return r;
  }

  dateToIntervalLabel(labelDate: Date): string {
    return "Week " + this.getWeekNr(labelDate);
  }

  floorDate(date: Date): Date {
    const r: Date = new Date(date);
    r.setDate(date.getDate() - date.getDay() + 1);
    return r;
  }

}

export class MonthScale extends ScaleType {
  readonly mode = "MONTH";

  dateToIntervalLabel(labelDate: Date): string {
    return Month[this.floorDate(labelDate).getMonth()];
  }


  floorDate(date: Date): Date {
    const r: Date = new Date(date);
    r.setHours(0, 0, 0, 0);
    r.setDate(1);
    return r;
  }

  dateByIndex(startDate: Date, index: number): Date {
    const r: Date = this.floorDate(startDate);
    r.setMonth(startDate.getMonth() + index);
    return r;
  }
}

export class QuarterlyScale extends ScaleType {
  readonly mode = "Quarter";

  dateToIntervalLabel(labelDate: Date): string {
    const prefix: string = "Q";
    const month: number = labelDate.getMonth();
    const n: number = month < 3 ? 1 : month < 6 ? 2 : month < 9 ? 3 : 4;
    return prefix + n.toString();
  }

  floorDate(date: Date): Date {
    const r: Date = new Date(date);
    r.setHours(0, 0, 0, 0);
    if (r.getMonth() < 3) {
      r.setMonth(0, 1);
    } else if (r.getMonth() < 6) {
      r.setMonth(3, 1);
    } else if (r.getMonth() < 9) {
      r.setMonth(6, 1);
    } else {
      r.setMonth(9, 1);
    }
    return r;
  }

  dateByIndex(startDate: Date, index: number): Date {
    const r = this.floorDate(startDate);
    r.setMonth(r.getMonth() + (3 * index));
    return this.floorDate(r);
  }
}

export class YearScale extends ScaleType {
  readonly mode = "YEAR";

  dateToIntervalLabel(labelDate: Date): string {
    return String(labelDate.getFullYear());
  }

  floorDate(date: Date): Date {
    const r: Date = new Date(date);
    r.setHours(0, 0, 0, 0);
    r.setFullYear(date.getFullYear(), 0, 1);
    return r;
  }

  dateByIndex(startDate: Date, index: number): Date {
    const r: Date = this.floorDate(startDate);
    r.setFullYear(startDate.getFullYear() + index);
    return r;
  }
}