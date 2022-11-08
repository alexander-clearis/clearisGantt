import {ScaleMode} from "./ScaleMode";
import {DayScale, MonthScale, WeekScale, YearScale} from "./TimeScalesHelpers";
import {Timeline} from "./Timeline";
import {iTaskController, mockTaskController} from "./TaskController";
import {ChartContent} from "../components/body/ChartContent";
import React from "react";

export interface iClearisGanttController {
    readonly scaleModeControllers: ScaleMode[];

    getChartTitle(): string;

    setChartTitle(value: string): void;

    timeLine(): Timeline;

    changeScale(newScale: ScaleMode): void;

    taskController(): iTaskController;

    viewLength(): number;

    viewHeight(): number;

    chartContentRef(): React.RefObject<ChartContent>
}

export class ClearisGanttController implements iClearisGanttController {
    private _chartTitle: string;
    private _timeLine: Timeline;
    private _taskController: iTaskController;

    private _chartContent: React.RefObject<ChartContent> = React.createRef<ChartContent>();

    private _viewLength: number;
    private _viewHeigth: number;

    readonly scaleModeControllers = [
        new ScaleMode("Day of the week", new WeekScale(), 1, new DayScale()),
        new ScaleMode("Month", new YearScale(), 1, new MonthScale()),
    ];

    constructor(name: string, singelIntervalLength: number) {
        this._chartTitle = name;
        this._timeLine = new Timeline(this.scaleModeControllers[1], singelIntervalLength, new Date(2019, 0, 1, 3, 0), new Date(2022, 0, 1, 3, 0));
        this._taskController = new mockTaskController();


        this._viewLength = singelIntervalLength;
        this._viewHeigth = 640;
    }

    getChartTitle(): string {
        return this._chartTitle;
    }

    setChartTitle(value: string) {
        this._chartTitle = value;
    }

    timeLine(): Timeline {
        return this._timeLine;
    }

    public changeScale(newScale: ScaleMode): void {
        this._timeLine = new Timeline(newScale, this.viewLength(), this._timeLine.startDate(), this._timeLine.endDate());
        this._chartContent.current?.newTimeLine(this._timeLine);
    }

    taskController(): iTaskController {
        return this._taskController;
    }


    viewLength(): number {
        return this._viewLength;
    }

    viewHeight(): number {
        return this._viewHeigth;
    }

    chartContentRef(): React.RefObject<ChartContent> {
        return this._chartContent;
    }
}

