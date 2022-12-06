import {MonthScale, YearScale} from "./scale/TimeScalesHelpers";
import {ScaleMode} from "./scale/ScaleMode";
import {iTimelineController, TimelineController} from "./TimelineController";
import {ChartContent} from "../view/content/ChartContent";
import React, {RefObject} from "react";
import {iNodeController} from "./TaskController";

export interface iGanttController {
    getTitle(): string

    setTitle(title: string): void

    getViewLength(): number

    getViewHeight(): number

    getDefaultScale(): string

    getAvailableScales(): Map<string, string>

    setScale(scaleID: string): void

    chartContentRef(): RefObject<ChartContent>;

    getTimeline(): iTimelineController;

    getNodes(): iNodeController[]
}

export class ClearisGanttController implements iGanttController {
    private title: string
    private viewLength: number
    private viewHeight: number
    private timeline: iTimelineController
    private chartContent: RefObject<ChartContent> = React.createRef<ChartContent>();

    private nodes: iNodeController[]

    readonly scaleControllerMap = [
        // new ScaleMode("Day of the week", new WeekScale(), 1, new DayScale()),
        new ScaleMode("1 Year", new YearScale(), 1, new MonthScale())
    ]
    readonly defaultScale = this.scaleControllerMap[0].getId()


    constructor(title: string, viewLength: number, viewHeight: number, nodes: iNodeController[]) {
        this.title = title;
        this.viewLength = viewLength;
        this.viewHeight = viewHeight;
        this.nodes = nodes;
        this.nodes.sort((a, b) => a.getStart().valueOf() < b.getStart().valueOf() ? -1 : a.getStart().valueOf() > b.getStart().valueOf() ? 1 : 0);
        console.log(this.nodes)

        this.timeline = this.generateTimeline(this.scaleControllerMap[0])
    }

    private generateTimeline(scaleMode: ScaleMode): iTimelineController {
        const nodesLength = this.nodes.length;
        if (nodesLength > 0) {
            return new TimelineController(
                scaleMode.parent().floorDate(this.nodes[0].getStart()),
                scaleMode.parent().ceilDate(this.nodes[nodesLength - 1].getEnd()),
                this.viewLength,
                scaleMode
            )
        } else {
            return new TimelineController(
                new Date(2021, 0, 1),
                new Date(2024, 0, 1),
                this.viewLength,
                scaleMode
            )
        }
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    getViewLength(): number {
        return this.viewLength
    }

    getViewHeight(): number {
        return this.viewHeight
    }

    getAvailableScales(): Map<string, string> {
        const r = new Map<string, string>();
        this.scaleControllerMap.forEach((value) => r.set(value.getId(), value.label()))
        return r;
    }

    getDefaultScale(): string {
        return this.defaultScale;
    }

    setScale = (scaleID: string): void => {
        if (this.timeline.scaleModeID() != scaleID) {
            const newScaleMode = this.scaleControllerMap.find(value => value.getId() === scaleID)!;
            this.timeline = this.generateTimeline(newScaleMode);
            this.chartContent.current?.renderNewTimeline(this.timeline);
        }
    }

    chartContentRef(): RefObject<ChartContent> {
        return this.chartContent
    };

    getTimeline(): iTimelineController {
        return this.timeline;
    }

    getNodes(): iNodeController[] {
        return this.nodes;
    };
}
