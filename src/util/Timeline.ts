import {ScaleMode} from "./ScaleMode";
import {ScaleType} from "./ScaleType";

export class Timeline {

    private _scaleMode: ScaleMode;
    private _startDate: Date;
    private _endDate: Date;
    private _singleScaleLength: number;


    constructor(scaleMode: ScaleMode, SingleScaleLength: number, startDate: Date, endDate: Date) {
        this._scaleMode = scaleMode;
        this._singleScaleLength = SingleScaleLength;
        this._startDate = scaleMode.parent.floorDate(startDate);
        this._endDate = scaleMode.parent.ceilDate(endDate);
    }

    public deltaTime(): number {
        return this._endDate.valueOf() - this._startDate.valueOf();
    }

    public abosolutePosition(date: Date): number {
        return ((date.valueOf() - this._startDate.valueOf()) / this.deltaTime()) * this.timelinePixelLength();
    }

    public relativePosistion(date: Date): number {
        const cDate = new Date(date);
        const relativeScale = this.scaleMode.relativeScaleType();
        const iStart = relativeScale.floorDate(cDate);
        const iEnd = relativeScale.ceilDate(cDate);

        const deltaTime = iEnd.getTime() - iStart.getTime();

        const fOnTime = (iStart.getTime() - cDate.getTime()) / deltaTime
        const iInbetween = relativeScale.intervalsInBetween(this.startDate, cDate);
        const relativeScaleLength = this.timelinePixelLength() / this.calculateScaleTypeApperanceOnThis(relativeScale);

        return (relativeScaleLength * iInbetween) + (relativeScaleLength * fOnTime);
    }

    public lengthOnTimeLine(startDate: Date, endDate: Date): number {
        return ((endDate.valueOf() - startDate.valueOf()) / this.deltaTime()) * this.timelinePixelLength();
    }

    calculateScaleTypeApperanceOnThis(scaleType: ScaleType) {
        let counter: number = 0;
        while (scaleType.dateByIndex(this._startDate, counter).valueOf() < this._endDate.valueOf()) {
            counter++;
        }
        return counter;
    }

    public ParentIntervalOnTimeLine(): number {
        let counter: number = 0;
        while (this._scaleMode.parent.dateByIndex(this._startDate, counter).valueOf() < this._endDate.valueOf()) {
            counter++;
        }
        return counter;
    }

    public timelinePixelLength(): number {
        return (this.ParentIntervalOnTimeLine() / this.scaleMode.parent_in_view) * this.singleScaleLength;
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

    get singleScaleLength(): number {
        return this._singleScaleLength;
    }

}