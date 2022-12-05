import {ScaleMode} from "./scale/ScaleMode";
import {ScaleType} from "./scale/ScaleType";


export interface iTimelineController {
    lengthInPixels(): number

    scaleModeID(): string

    dateToNumber(startDate: Date, endDate?: Date): number;

    numberToDate(number: number): Date;
}


export type timeXvalue = {
    date: Date,
    x: number,
}
export type scaleProps = {
    start: timeXvalue;
    end: timeXvalue;
}

export class TimelineController implements iTimelineController {
    private scaleMode: ScaleMode;
    private amountOfDays: number
    private dayPixeLength: number;
    private scaleProps: Map<string, scaleProps[]> = new Map<string, scaleProps[]>()
    private CommontimeXValues: timeXvalue[] = []

    private endDate: Date;
    private startDate: Date;


    constructor(startDate: Date, endDate: Date, viewLength: number, scaleMode: ScaleMode) {
        this.scaleMode = scaleMode

        this.startDate = this.scaleMode.parent().floorDate(startDate)
        this.endDate = this.scaleMode.parent().ceilDate(endDate)
        this.amountOfDays = this.calculateAmountOfDays(startDate, endDate)
        this.dayPixeLength = Math.floor(this.amountOfDays / viewLength)
        this.scaleProps.set(scaleMode.parent().getID(), this.generateScaleProps(scaleMode.parent()))
        if (scaleMode.child()) {
            this.scaleProps.set(scaleMode.child()!.getID(), this.generateScaleProps(scaleMode.child()!))
        }
        this.CommontimeXValues.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0)
    }

    calculateAmountOfDays(startDate: Date, endDate: Date): number {
        var diff = Math.abs(startDate.valueOf() - endDate.valueOf());
        return Math.ceil(diff / (1000 * 3600 * 24));
    }


    numberToDate(number: number): Date {
        const amountOfDays = number / this.dayPixeLength
        return new Date(this.startDate.valueOf() + (amountOfDays * (1000 * 3600 * 24)));
    }

    dateToNumber(startDate: Date, endDate?: Date): number {
        if (endDate) {
            const delta = endDate.valueOf() - startDate.valueOf();
            return delta * this.dayPixeLength
        } else {
            const delta = this.startDate.valueOf() - startDate.valueOf();
            return delta * this.dayPixeLength;
        }
    }

    generateScaleProps(scaleType: ScaleType): scaleProps[] {
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
                end: this.newTimeXValue(intervalStartDate, elapsedPixels + elapsedPixels, checkCommonValues)
            };

            scalePropsArray.push(scaleProps)
            elapsedPixels += intervalLength;
        }
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

    getRelativeScaleMap(): scaleProps[] {
        return this.scaleProps.get(this.scaleMode.relativeScaleType().getID())!;
    }
    getParentScaleMap(): scaleProps[] | undefined {
        return this.scaleProps.get(this.scaleMode.parent().getID())
    }
    getChildScaleMap(): scaleProps[] | undefined {
        if(this.scaleMode.child()) {
            this.scaleProps.get(this.scaleMode.child()!.getID())
        }
        return undefined
    }


    scaleModeID(): string {
        return this.scaleMode.getId()
    }

    lengthInPixels(): number {
        return this.dayPixeLength * this.amountOfDays;
    }
}