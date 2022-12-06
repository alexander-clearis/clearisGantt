import {ScaleMode} from "./scale/ScaleMode";
import {ScaleType} from "./scale/ScaleType";
import {scaleProps, timeXvalue} from "../../util/ExtraTypes";


export interface iTimelineController {
    lengthInPixels(): number

    scaleModeID(): string

    dateToNumber(startDate: Date, endDate?: Date): number;

    numberToDate(number: number): Date;

    calculateAmountOfDays(startDate: Date, endDate: Date): number

    getScaleMode(): ScaleMode

    getRelativeScaleMap(): scaleProps[]

    getParentScaleMap(): scaleProps[]

    getChildScaleMap(): scaleProps[] | undefined

}


export class TimelineController implements iTimelineController {
    private scaleMode: ScaleMode;
    private amountOfDaysInView: number
    private dayPixeLength: number;
    private scaleProps: Map<string, scaleProps[]> = new Map<string, scaleProps[]>()
    private CommontimeXValues: timeXvalue[] = []

    private endDate: Date;
    private startDate: Date;


    constructor(startDate: Date, endDate: Date, viewLength: number, scaleMode: ScaleMode) {
        this.scaleMode = scaleMode

        this.startDate = this.scaleMode.parent().floorDate(startDate)
        this.endDate = this.scaleMode.parent().ceilDate(endDate)
        this.amountOfDaysInView = this.calculateAmountOfDays(startDate, scaleMode.parent().dateByIndex(startDate, scaleMode.parent_in_view()))
        console.log(scaleMode.parent().dateByIndex(startDate, scaleMode.parent_in_view()));
        console.log(this.amountOfDaysInView)
        this.dayPixeLength = Math.floor(viewLength / this.amountOfDaysInView)
        this.scaleProps.set(scaleMode.parent().getID(), this.generateScaleProps(scaleMode.parent()))
        if (scaleMode.child()) {
            this.scaleProps.set(scaleMode.child()!.getID(), this.generateScaleProps(scaleMode.child()!))
        }
        this.CommontimeXValues.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0)
    }

    public calculateAmountOfDays(startDate: Date, endDate: Date): number {
        var diff = Math.abs(startDate.valueOf() - endDate.valueOf());
        return Math.round(diff / (1000 * 3600 * 24));
    }


    public numberToDate(number: number): Date {
        const amountOfDays = number / this.dayPixeLength
        return new Date(this.startDate.valueOf() + (amountOfDays * (1000 * 3600 * 24)));
    }

    public dateToNumber(data1: Date, date2?: Date): number {
        if (date2) {
            const delta = this.calculateAmountOfDays(data1, date2);
            return delta * this.dayPixeLength
        } else {
            const delta = this.calculateAmountOfDays(this.startDate, data1);
            return delta * this.dayPixeLength;
        }
    }

    private generateScaleProps(scaleType: ScaleType): scaleProps[] {
        const scalePropsArray: scaleProps[] = []

        let i = 0;
        let intervalStartDate = new Date(scaleType.dateByIndex(this.startDate, i));
        let intervalEndDate = scaleType.ceilDate(intervalStartDate);
        let elapsedPixels = 0;
        const checkCommonValues = (this.CommontimeXValues.length > 0).valueOf();

        for (; intervalEndDate.valueOf() <= this.endDate.valueOf(); i++, intervalStartDate = new Date(scaleType.dateByIndex(this.startDate, i)), intervalEndDate = scaleType.ceilDate(intervalStartDate)) {
            const intervalLength = this.dateToNumber(intervalStartDate, intervalEndDate)
            const scaleProps: scaleProps = {
                start: this.newTimeXValue(intervalStartDate, elapsedPixels, checkCommonValues),
                end: this.newTimeXValue(intervalEndDate, elapsedPixels + intervalLength, checkCommonValues)
            };

            scalePropsArray.push(scaleProps)
            elapsedPixels += intervalLength;
        }
        scalePropsArray.sort((a, b) => a.start.x < b.start.x ? -1 : a.start.x > b.start.x ? 1 : 0)
        return scalePropsArray;
    }

    newTimeXValue(date: Date, x: number, checkCommonValues: boolean): timeXvalue {
        let r = {
            date: date,
            x: x
        };
        if (checkCommonValues) {
            const knownValue = this.CommontimeXValues.find(value => value.date.valueOf() === date.valueOf());
            if (knownValue) {
                return knownValue;
            } else {
                this.CommontimeXValues.push(r);
            }
        }
        return r;
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
        return this.dayPixeLength * this.amountOfDaysInView;
    }
}