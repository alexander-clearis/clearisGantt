import {DayScale, MonthScale, WeekScale, YearScale} from "./scale/TimeScalesHelpers";
import {ScaleMode} from "./scale/ScaleMode";
import {iTimelineController} from "./TimelineController";

export interface iGanttController {
    getTitle(): string

    getViewLength(): number

    getViewHeight(): number

    setScale(scaleID: string): void
    //chartContentRef(): RefObject<any>;
}

export class ClearisGanttController implements iGanttController {
    private title: string
    private viewLength: number
    private viewHeight: number
    private timeLine!: iTimelineController

    readonly scaleControllerMap = [
        new ScaleMode("Day of the week", new WeekScale(), 1, new DayScale()),
        new ScaleMode("Month", new YearScale(), 1, new MonthScale())
    ]


    constructor(title: string, viewLength: number, viewHeight: number) {
        this.title = title;
        this.viewLength = viewLength;
        this.viewHeight = viewHeight;
    }


    getTitle(): string {
        return this.title;
    }

    getViewLength(): number {
        return this.viewLength
    }

    getViewHeight(): number {
        return this.viewHeight
    }

    getAvailableScales(): Map<string, string> {
        const r = new Map<string, string>();
        this.scaleControllerMap.forEach((value) => r.set(value.label(), value.label()))
        return r;
    }

    setScale(scaleID: string): void {
        if (this.timeLine.scaleModeID() != scaleID) {
            const newScaleMode = this.scaleControllerMap.find(value => value.getId() === scaleID);
            console.log(newScaleMode);
            //todo: set new timeline
        }
    }
}
