import {DayScale, MonthScale, WeekScale, YearScale} from "./scale/TimeScalesHelpers";
import {ScaleMode} from "./scale/ScaleMode";
import {iTimelineController, TimelineController} from "./TimelineController";
import {ChartContent} from "../view/content/ChartContent";
import React, {RefObject} from "react";
import {iNodeController, NodeController} from "./NodeController";
import {SnapController} from "./SnapController";

export interface iGanttController {
    getTitle(): string

    bindSave(): void

    bindCancel(): void

    setTitle(title: string): void

    setSave(newSave: () => void): void

    setCancel(newCancel: () => void): void


    getViewLength(): number

    getViewHeight(): number

    getDefaultScale(): string

    getAvailableScales(): Map<string, string>

    setScale(scaleID: string): void

    chartContentRef(): RefObject<ChartContent>;

    getTimeline(): iTimelineController;

    addNodes(nodes: iNodeController[]): void;

    getNodes(): iNodeController[]

    getSnapController(): SnapController
}

export class ClearisGanttController implements iGanttController {
    private title: string
    private viewLength: number
    private viewHeight: number
    private timeline: iTimelineController
    private chartContent: RefObject<ChartContent> = React.createRef<ChartContent>();
    private nodes: iNodeController[]
    private snapController: SnapController;
    private saveMethod: () => void = () => {
        console.log("NO SAVE ACTION!, use setSave")
    };
    private cancelMethod: () => void = () => {
        console.log("NO CANCEL ACTION! use setCancel")
    }

    readonly scaleControllerMap = [
        // new ScaleMode("Day of the week", new WeekScale(), 1, new DayScale()),
        new ScaleMode("Month / Year", new YearScale(), 1, new MonthScale()),
        new ScaleMode("Day / Month", new MonthScale(), 2, new DayScale()),
        new ScaleMode("Week / Month", new MonthScale(), 4, new WeekScale()),
        new ScaleMode("Day / Week", new WeekScale(), 7, new DayScale())
    ]
    readonly defaultScale = this.scaleControllerMap[0].getId()

    constructor(title: string, viewLength: number, viewHeight: number, nodes: iNodeController[]) {
        this.title = title;
        this.viewLength = viewLength;
        this.viewHeight = viewHeight;
        this.nodes = nodes;
        this.sortNodes();
        this.timeline = this.generateTimeline(this.scaleControllerMap[0])
        this.snapController = new SnapController(this.timeline.getCommonTimeXValues(), NodeController.getNodes())
    }

    private sortNodes() {
        this.nodes = this.nodes.sort((a, b) => a.getStart().valueOf() < b.getStart().valueOf() ? -1 : a.getStart().valueOf() > b.getStart().valueOf() ? 1 : 0);
    }

    private generateTimeline(scaleMode: ScaleMode): iTimelineController {
        const nodesLength = this.nodes.length;
        if (nodesLength > 0) {
            return new TimelineController(
                this.nodes[0].getStart(),
                this.nodes[nodesLength - 1].getEnd(),
                this.viewLength,
                scaleMode
            )
        } else {
            return new TimelineController(
                new Date(),
                new Date(),
                this.viewLength,
                scaleMode
            )
        }
    }

    public addNodes(nodes: iNodeController[]): void {
        const currentAmount = this.nodes.length;
        this.nodes.push(...nodes);
        this.sortNodes();

        if (currentAmount == 0 || this.nodes[0].getStart().valueOf() <= this.timeline.startDate().valueOf() || this.nodes[this.nodes.length - 1].getEnd().valueOf() <= this.timeline.endDate().valueOf()) {
            this.timeline = this.generateTimeline(this.timeline.getScaleMode());
            this.snapController.newSetup(this.timeline.getCommonTimeXValues(), this.nodes);
            this.chartContent.current?.renderNewSetUp(this.timeline, this.nodes)
        } else {
            this.snapController.newNodes(this.nodes)
            this.chartContent.current?.rerenderNodes(this.nodes);
        }
    }


    getTitle(): string {
        return this.title;
    }
    bindSave = (): void => {
        this.saveMethod()
    }
    bindCancel= (): void =>{
        this.cancelMethod()
    }

    setTitle(title: string): void {
        this.title = title;
    }

    setSave(newSave: () => void): void {
        this.saveMethod = newSave;
    }

    setCancel(newCancel: () => void): void {
        this.cancelMethod = newCancel;
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
            this.snapController.newCommonTimeXValues(this.timeline.getCommonTimeXValues());
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

    getSnapController(): SnapController {
        return this.snapController;
    }


}
