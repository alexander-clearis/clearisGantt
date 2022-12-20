import {ScaleMode} from "./scale/ScaleMode";
import {ScaleType} from "./scale/ScaleType";
import {scaleProps, timeXvalue} from "../../util/ExtraTypes";


export interface iTimelineController {
    lengthInPixels(): number

    scaleModeID(): string

    dateToNumber: (startDate: Date, endDate?: Date) => number;

    numberToDate(number: number): Date;

    calculateAmountOfDays(startDate: Date, endDate: Date): number

    getScaleMode(): ScaleMode

    getRelativeScaleMap(): scaleProps[]

    getParentScaleMap(): scaleProps[]

    getChildScaleMap(): scaleProps[] | undefined

    getCommonTimeXValues(): timeXvalue[];


    lengthInPixels(): number

    dayInPixel(): number

    startDate(): Date
    endDate(): Date
}


export class TimelineController implements iTimelineController {
    private scaleMode: ScaleMode;
    private timelineLength: number;
    private dayPixeLength: number;
    private scaleProps: Map<string, scaleProps[]> = new Map<string, scaleProps[]>()
    private commonTimeXValues: timeXvalue[] = []

    private _endDate: Date;
    private _startDate: Date;


    constructor(startDate: Date, endDate: Date, viewLength: number, scaleMode: ScaleMode) {
        this.scaleMode = scaleMode

        this._startDate = this.scaleMode.parent().dateByIndex(startDate, -1)
        this._endDate = this.scaleMode.parent().ceilDate(this.scaleMode.parent().dateByIndex(endDate, 1))
        let amountOfDaysInView = this.calculateAmountOfDays(this._startDate, scaleMode.parent().dateByIndex(this._startDate, scaleMode.parent_in_view()))

        this.dayPixeLength = Math.floor(viewLength / amountOfDaysInView)
        this.timelineLength = this.dateToNumber(this._startDate, this._endDate);
        this.scaleProps.set(scaleMode.parent().getID(), this.generateScaleProps(scaleMode.parent()))
        if (scaleMode.child()) {
            this.scaleProps.set(scaleMode.child()!.getID(), this.generateScaleProps(scaleMode.child()!))
        }
        this.commonTimeXValues.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0);

    }

    public calculateAmountOfDays(startDate: Date, endDate: Date): number {
        const diff =  endDate.valueOf() - startDate.valueOf();
        return Math.round(diff / (1000 * 3600 * 24));
    }


    public numberToDate(number: number): Date {
        const amountOfDays = number / this.dayPixeLength
        return new Date(this._startDate.valueOf() + (amountOfDays * (1000 * 3600 * 24)));
    }

    public dateToNumber = (data1: Date, date2?: Date): number => {
        if (date2) {
            const delta = this.calculateAmountOfDays(data1, date2);
            return delta * this.dayPixeLength
        } else {
            const delta = this.calculateAmountOfDays(this._startDate, data1);
            return delta * this.dayPixeLength;
        }
    }

    private generateScaleProps(scaleType: ScaleType): scaleProps[] {
        const scalePropsArray: scaleProps[] = []

        let i = 0;
        let intervalStartDate = scaleType.floorDate(this._startDate);
        let intervalEndDate = scaleType.ceilDate(intervalStartDate);

        let elapsedPixels = this.dateToNumber(intervalStartDate);
        for (; intervalEndDate.valueOf() <= this._endDate.valueOf(); i++, intervalStartDate = new Date(scaleType.dateByIndex(this._startDate, i)), intervalEndDate = scaleType.ceilDate(intervalStartDate)) {
            const intervalLength = this.dateToNumber(intervalStartDate, intervalEndDate)
            const scaleProps: scaleProps = {
                start: this.newTimeXValue(intervalStartDate, elapsedPixels),
                end: this.newTimeXValue(intervalEndDate, elapsedPixels + intervalLength)
            };
            scalePropsArray.push(scaleProps)
            elapsedPixels += intervalLength;
        }
        scalePropsArray.sort((a, b) => a.start.x < b.start.x ? -1 : a.start.x > b.start.x ? 1 : 0)
        return scalePropsArray;
    }

    newTimeXValue(date: Date, x: number): timeXvalue {
        let r = {
            date: date,
            x: x
        };
        const knownValue = this.commonTimeXValues.find(value => value.date.valueOf() === date.valueOf());
        if (knownValue) {
            return knownValue;
        } else {
            this.commonTimeXValues.push(r);
        }
        return r;
    }

    public getCommonTimeXValues(): timeXvalue[] {
        return this.commonTimeXValues;
    }

    public getRelativeScaleMap(): scaleProps[] {
        return this.scaleProps.get(this.scaleMode.relativeScaleType().getID())!;
    }

    public getParentScaleMap(): scaleProps[] {
        return this.scaleProps.get(this.scaleMode.parent().getID())!
    }

    public getChildScaleMap(): scaleProps[] | undefined {
        if (this.scaleMode.child()) {
            return this.scaleProps.get(this.scaleMode.child()!.getID())
        }
        return undefined
    }


    public scaleModeID(): string {
        return this.scaleMode.getId()
    }

    public getScaleMode(): ScaleMode {
        return this.scaleMode;
    }

    public lengthInPixels(): number {
        return this.timelineLength;
    }

    public dayInPixel(): number {
        return this.dayPixeLength;
    }
    public startDate(): Date {
        return this._startDate
    }
    public endDate(): Date {
        return this._endDate;
    }
}