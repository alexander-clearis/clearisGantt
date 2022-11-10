import {ScaleMode} from "./ScaleMode";
import {ScaleType} from "./ScaleType";

export type positionOnTimeLine = {
    date: Date;
    position: number;
}

export class TimeInterval {
    readonly start: positionOnTimeLine;
    readonly end: positionOnTimeLine
    readonly lengthInMs: number;
    readonly lengthInPixels: number;


    constructor(startDate: Date, startPixel: number, endDate: Date, lengthInPixels: number) {
        this.start = {date: startDate, position: startPixel}
        this.end = {date: endDate, position: startPixel + lengthInPixels}
        this.lengthInMs = endDate.valueOf() - startDate.valueOf()
        this.lengthInPixels = lengthInPixels;
    }

    public calculatePosistionInInterval(date: Date): number {
        return ((date.valueOf() - this.start.date.valueOf()) * this.lengthInPixels) / this.lengthInMs;
    }
}

export class FriendlyTimeline {
    private _scaleMode: ScaleMode;
    private _startDate: Date;
    private _endDate: Date;

    private DaysInPixels: number;



    public ScaleHeaderParent: Map<number, TimeInterval> = new Map<number, TimeInterval>()
    public ScaleHeaderChild: Map<number, TimeInterval> = new Map<number, TimeInterval>()
    public chartContentScale: Map<number, TimeInterval> = new Map<number, TimeInterval>()
    public SnapPoints: Map<number, TimeInterval> = new Map<number, TimeInterval>();

    constructor(scaleMode: ScaleMode, SingleScaleLength: number, startDate: Date, endDate: Date) {
        this._scaleMode = scaleMode;
        this._startDate = scaleMode.parent().floorDate(startDate);
        this._endDate = scaleMode.parent().ceilDate(endDate);
        const maxDaysInView = this.calcAmountOfDays(startDate, scaleMode.parent().dateByIndex(startDate, scaleMode.parent_in_view()))
        this.DaysInPixels = SingleScaleLength / maxDaysInView;
        this.generateScale();
    }

    calcAmountOfDays(startDate: Date, endDate: Date): number {
        var diff = Math.abs(startDate.getTime() - endDate.getTime());
        return Math.abs(diff / (1000 * 3600 * 24));
    }

    private generateScale() {

        //broken empty check!
        const child = this._scaleMode.child();
        if (child) {
            this.scaleToMap(this._scaleMode.parent(), this.ScaleHeaderParent)
            this.scaleToMap(child, ...[this.ScaleHeaderChild, this.chartContentScale, this.SnapPoints])
        } else {
            this.scaleToMap(this._scaleMode.parent(), this.ScaleHeaderParent, this.chartContentScale, this.SnapPoints)
        }
    }

    private scaleToMap(scaleType: ScaleType, ...maps: Map<number, TimeInterval>[]) {
        let i = 0;
        let intervalStartDate = new Date(scaleType.dateByIndex(this._startDate, i));
        let intervalEndDate = scaleType.ceilDate(intervalStartDate);
        let elapsedPixels = 0;


        for (; intervalEndDate.valueOf() <= this._endDate.valueOf(); i++, intervalStartDate = new Date(scaleType.dateByIndex(this._startDate, i)), intervalEndDate = scaleType.ceilDate(intervalStartDate)) {
            const intervalLength = this.lengthOnTimeLine(intervalStartDate, intervalEndDate)
            const ti: TimeInterval = new TimeInterval(intervalStartDate, elapsedPixels,
                intervalEndDate, intervalLength)

            this.chartContentScale.set(this._startDate.valueOf(), ti)
            maps.forEach(map => map.set(intervalStartDate.valueOf(), ti))
            elapsedPixels += intervalLength;
        }
    }

    public lengthOnTimeLine(startDate: Date, endDate: Date): number {
        return this.calcAmountOfDays(startDate, endDate) * this.DaysInPixels;
    };

    public relativePosistion(date: Date): number {
        return this.calcAmountOfDays(this._startDate, date) * this.DaysInPixels;
    };

    public scaleMode(): ScaleMode {
        return this._scaleMode;
    }
}