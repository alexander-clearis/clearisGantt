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
        const relativeScale = this._scaleMode.relativeScaleType();
        const iStart = relativeScale.floorDate(cDate);

        const iEnd = relativeScale.ceilDate(cDate);

        const deltaTime = iEnd.getTime() - iStart.getTime();
        const fOnTime = (cDate.getTime() - iStart.getTime()) / deltaTime
        const iInbetween = relativeScale.intervalsInBetween(this._startDate, cDate);

        const relativeScaleLength = this.timelinePixelLength() / this.calculateScaleTypeApperanceOnThis(relativeScale);

        const r = (relativeScaleLength * iInbetween) + (relativeScaleLength * fOnTime);
        return r;
    }


    public calculateDateByPosition(newPos: number): Date {
        const relativeScale = this._scaleMode.relativeScaleType();
        const relativeScaleLength = this.timelinePixelLength() / this.calculateScaleTypeApperanceOnThis(relativeScale);
        const inInterval = Math.floor(newPos / relativeScaleLength);

        const intervalStartDate = this._scaleMode.relativeScaleType().dateByIndex(this._startDate, inInterval);
        const intervalEnd = this._scaleMode.relativeScaleType().ceilDate(intervalStartDate);
        const intervalLengthTime = intervalEnd.valueOf() - intervalStartDate.valueOf();
        const absolutePosOnInterval = newPos % relativeScaleLength;
        const correctionTime = ((intervalLengthTime * absolutePosOnInterval) / relativeScaleLength);

        return new Date(intervalStartDate.valueOf() + correctionTime);
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
        return (this.ParentIntervalOnTimeLine() / this._scaleMode.parent_in_view) * this.singleScaleLength();
    }

    public nearestSnapToDate(date: Date): Date {
        const iStart = this.scaleMode().relativeScaleType().floorDate(date);
        const iEnd = this.scaleMode().relativeScaleType().ceilDate(date);

        return ((date.valueOf() - iStart.valueOf()) <= iEnd.valueOf()) ? iStart : iEnd
    }

    public closesSnapToPoint(pos: number): number {
        const relativeScale = this._scaleMode.relativeScaleType();
        const relativeScaleLength = this.timelinePixelLength() / this.calculateScaleTypeApperanceOnThis(relativeScale);
        const posInInt = pos % relativeScaleLength;

        return (posInInt <= relativeScaleLength) ? pos - posInInt : pos - posInInt + relativeScaleLength

    }

    scaleMode(): ScaleMode {
        return this._scaleMode;
    }

    startDate(): Date {
        return this._startDate;
    }


    endDate(): Date {
        return this._endDate;
    }

    singleScaleLength(): number {
        return this._singleScaleLength;
    }

}