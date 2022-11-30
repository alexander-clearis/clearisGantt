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

export type positionOnTimeLine = {
    date: Date;
    position: number;
}