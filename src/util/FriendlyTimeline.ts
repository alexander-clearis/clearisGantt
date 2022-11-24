import {ScaleMode} from "./ScaleMode";
import {ScaleType} from "./ScaleType";
import {iTimeline} from "./ITimeline";

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

export class FriendlyTimeline implements iTimeline {
    private _scaleMode: ScaleMode;
    private _startDate: Date;
    private _endDate: Date;
    private _pixellengt: number;
    private DaysInPixels: number;

    public _scaleParentMap: Map<number, TimeInterval> = new Map<number, TimeInterval>()
    public _scaleChildMap: Map<number, TimeInterval> = new Map<number, TimeInterval>()
    public _contentScale: Map<number, TimeInterval> = new Map<number, TimeInterval>()
    public contentPoints: Map<number, TimeInterval> = new Map<number, TimeInterval>();
    public snapPoints: Map<number, SnapPoint[]> = new Map<number, SnapPoint[]>();

    constructor(scaleMode: ScaleMode, SingleScaleLength: number, startDate: Date, endDate: Date) {
        this._scaleMode = scaleMode;
        this._startDate = scaleMode.parent().floorDate(startDate);
        this._endDate = scaleMode.parent().ceilDate(endDate);

        const maxDaysInView = this.calcAmountOfDays(startDate, scaleMode.parent().dateByIndex(startDate, scaleMode.parent_in_view()))
        this.DaysInPixels = Math.floor(SingleScaleLength / maxDaysInView);
        this._pixellengt = this.DaysInPixels * this.calcAmountOfDays(this._startDate, this._endDate)
        this.generateScale();
        this.generateSnapPoints(this.contentPoints)
    }

    contentScaleMap(): Map<number, TimeInterval> {
        return this._contentScale;
    }

    scaleParentMap(): Map<number, TimeInterval> {
        return this._scaleParentMap;
    }

    scaleChildMap(): Map<number, TimeInterval> {
        return this._scaleChildMap;
    }


    public calcAmountOfDays(startDate: Date, endDate: Date): number {
        var diff = Math.abs(startDate.valueOf() - endDate.valueOf());
        return Math.ceil(diff / (1000 * 3600 * 24));
    }

    private generateScale() {

        //broken empty check!
        const child = this._scaleMode.child();
        if (child) {
            this.scaleToMap(child, ...[this._scaleChildMap, this._contentScale])
            this.scaleMapRelative(this._scaleMode.parent(), this._scaleChildMap, child, this._scaleParentMap)
        } else {
            this.scaleToMap(this._scaleMode.parent(), this._scaleParentMap, this._contentScale, this.contentPoints)
        }
        this.generateContentPoints(this._contentScale);

    }

    public scaleMapRelative(scaleType: ScaleType, relativeMap: Map<number, TimeInterval>, relativeScaleType: ScaleType, ...maps: Map<number, TimeInterval>[]) {
        let i = 0;
        let intervalStartDate = new Date(scaleType.dateByIndex(this._startDate, i));
        let intervalEndDate = scaleType.ceilDate(intervalStartDate);
        for (; intervalEndDate.valueOf() <= this._endDate.valueOf(); i++, intervalStartDate = new Date(scaleType.dateByIndex(this._startDate, i)), intervalEndDate = scaleType.ceilDate(intervalStartDate)) {
            const relativePos = relativeMap.get(intervalStartDate.valueOf()) ?? relativeMap.get(relativeScaleType.floorDate(intervalStartDate).valueOf())
            if (relativePos) {
                const endsInInterval = relativeMap.get(relativeScaleType.floorDate(intervalEndDate).valueOf());
                if (endsInInterval) {
                    const relativeLength = endsInInterval.start.position + endsInInterval.lengthInPixels - relativePos.start.position;
                    const ti: TimeInterval = new TimeInterval(intervalStartDate, relativePos.start.position, intervalEndDate, relativeLength)
                    maps.forEach(map => map.set(intervalStartDate.valueOf(), ti))
                }
            }
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

            maps.forEach(map => map.set(intervalStartDate.valueOf(), ti))
            elapsedPixels += intervalLength;
        }
    }

    public lengthOnTimeLine(startDate: Date, endDate: Date): number {
        return this.calcAmountOfDays(startDate, endDate) * this.DaysInPixels;
    };

    public relativePosition(date: Date): number {
        // const inInterval = this._contentScale.get(this._scaleMode.relativeScaleType().floorDate(date).valueOf());
        // if (inInterval) {
        //     if (date.valueOf() === inInterval.start.date.valueOf()) {
        //         return inInterval.start.position;
        //     } else {
        //         return inInterval.calculatePosistionInInterval(date);
        //     }
        // } else {
        //     throw new Error("no interval found for date: " + date)
        // }
        return this.calcAmountOfDays(this._startDate, date) * this.DaysInPixels;
    };


    findNearestSnap(point: number): SnapPoint {
        return this.snapPoints.get(this.closestKeyToPoint(point))![0]!;
    }
    closestKeyToPoint(point: number): number {
        return Array.from(this.snapPoints.keys()).reduce(function(prev, curr): number {
            return (Math.abs(curr - point) < Math.abs(prev - point) ? curr : prev);
        });
    }

    inInterval(pos: number): TimeInterval {
        const points = Array.from(this.contentPoints.keys()).sort();
        for (let i = 0; i < points.length; i++) {
            if (points[i] <= pos && pos < points[i + 1]) {
                const r = this.contentPoints.get(points[i]);
                if (r) {
                    return r
                } else {
                    break;
                }
            }
        }
        throw Error("point not on line");
    }

    startDate(): Date {
        return this._startDate;
    }

    endDate(): Date {
        return this._endDate;
    }


    public scaleMode(): ScaleMode {
        return this._scaleMode;
    }

    private generateContentPoints(chartContentScale: Map<number, TimeInterval>) {
        chartContentScale.forEach(value => {
            this.contentPoints.set(value.start.position, value)
        })
    }

    private generateSnapPoints(relativeScaleMap: Map<number, TimeInterval>) {
        relativeScaleMap.forEach((value, key) => this.snapPoints.set(key, [new SnapPoint(SnapType.Interval, value.start)]));
    }

    timelinePixelLength(): number {
        return this._pixellengt;
    }
}


export enum SnapType {
    Task,
    Interval
}

export class SnapPoint {
    public readonly SnapType: SnapType;
    public position: positionOnTimeLine;
    public readonly taskID?: string;


    constructor(SnapType: SnapType, position: positionOnTimeLine, taskID?: string) {
        this.SnapType = SnapType;
        this.position = position;
        this.taskID = taskID;
    }

    snapBefore(): positionOnTimeLine {
        const rdate  = new Date(this.position.date);
        rdate.setMinutes(-1);
        return {position: this.position.position - 1, date: rdate}
    }

    snapOn(): positionOnTimeLine {
        return {...this.position}
    }
}


