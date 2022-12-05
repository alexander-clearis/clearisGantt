import {Day} from "./Day";
import {Month} from "./Month";
import {ScaleType} from "./ScaleType";

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
        r.setHours(23, 59, 59, 0);
        return r;
    }

    dateByIndex(startDate: Date, index: number): Date {
        const r: Date = new Date(this.floorDate(startDate));
        r.setDate(startDate.getDate() + index);
        return r;
    }

    intervalsInBetween(date1: Date, date2: Date): number {
        let difference = date2.getTime() - date1.getTime();
        const r = difference / (1000 * 3600 * 24 * 7);
        return Math.floor(r);
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
        return 1 + Math.floor((firstThursday - tdt.valueOf()) / 604800000);
    }

    dateByIndex(startDate: Date, index: number): Date {
        const r: Date = this.floorDate(startDate);
        r.setDate(startDate.getDate() + (index * 7));
        return r;
    }

    dateToIntervalLabel(labelDate: Date): string {
        return "Week " + this.getWeekNr(labelDate) + " " + labelDate.getFullYear();
    }

    floorDate(date: Date): Date {
        const r: Date = new Date(date);
        r.setDate(date.getDate() - date.getDay() + 1);
        return r;
    }

    ceilDate(date: Date): Date {
        const r: Date = this.dateByIndex(this.floorDate(date), 1);
        r.setMinutes(-1)
        return r;
    }

    intervalsInBetween(date1: Date, date2: Date): number {
        let difference = date2.getTime() - date1.getTime();
        const r = difference / (1000 * 3600 * 24 * 7);
        return Math.floor(r)
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


    intervalsInBetween(date1: Date, date2: Date): number {
        //Because....  intervalsInBetween(new Date("Dec 02, 2016"), new Date("Jan 01, 2017")) = 0
        //Months will be calculated between start and end dates.
        //Make sure start date is less than end date.
        //But remember if the difference should be negative.
        var startDate = date1;
        var endDate = date2;
        var inverse = false;
        if (date1 > date2) {
            startDate = date2;
            endDate = date1;
            inverse = true;

        }

        //Calculate the differences between the start and end dates
        var yearsDifference = endDate.getFullYear() - startDate.getFullYear();
        var monthsDifference = endDate.getMonth() - startDate.getMonth();
        var daysDifference = endDate.getDate() - startDate.getDate();

        var monthCorrection = 0;

        //If the day difference between the 2 months is negative, the last month is not a whole month.
        if (daysDifference < 0) {
            monthCorrection = -1;
        }

        return (inverse ? -1 : 1) * (yearsDifference * 12 + monthsDifference + monthCorrection);
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

    intervalsInBetween(date1: Date, date2: Date): number {
        {
            //Because....  intervalsInBetween(new Date("Dec 02, 2016"), new Date("Jan 01, 2017")) = 0
            //Months will be calculated between start and end dates.
            //Make sure start date is less than end date.
            //But remember if the difference should be negative.
            var startDate = this.ceilDate(date1);
            var endDate = this.floorDate(date2);
            var inverse = false;
            if (date1 > date2) {
                startDate = this.ceilDate(date2);
                endDate = this.floorDate(date1);
                inverse = true;

            }

            //Calculate the differences between the start and end dates
            var yearsDifference = endDate.getFullYear() - startDate.getFullYear();
            var monthsDifference = endDate.getMonth() - startDate.getMonth();
            var daysDifference = endDate.getDate() - startDate.getDate();

            var monthCorrection = 0;

            //If the day difference between the 2 months is negative, the last month is not a whole month.
            if (daysDifference < 0) {
                monthCorrection = -1;
            }
            const monthsInBetween = (inverse ? -1 : 1) * (yearsDifference * 12 + monthsDifference + monthCorrection);
            return (Math.floor(monthsInBetween / 3));
        }


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

    intervalsInBetween(date1: Date, date2: Date): number {
        //Because....  intervalsInBetween(new Date("Dec 02, 2016"), new Date("Jan 01, 2017")) = 0
        //Months will be calculated between start and end dates.
        //Make sure start date is less than end date.
        //But remember if the difference should be negative.
        var startDate = this.ceilDate(date1);
        var endDate = this.floorDate(date2);
        var inverse = false;
        if (date1 > date2) {
            startDate = this.ceilDate(date2);
            endDate = this.floorDate(date1);
            inverse = true;

        }

        //Calculate the differences between the start and end dates
        var yearsDifference = endDate.getFullYear() - startDate.getFullYear();
        var monthsDifference = endDate.getMonth() - startDate.getMonth();
        var daysDifference = endDate.getDate() - startDate.getDate();

        var monthCorrection = 0;
        //If roundUpFractionalMonths is true, check if an extra month needs to be added from rounding up.
        //The difference is done by ceiling (round up), e.g. 3 months and 1 day will be 4 months.
        //If the day difference between the 2 months is negative, the last month is not a whole month.
         if (daysDifference < 0) {
            monthCorrection = -1;
        }
        const monthsInBetween = (inverse ? -1 : 1) * (yearsDifference * 12 + monthsDifference + monthCorrection);
        return (Math.floor(monthsInBetween / 12));
    }
}