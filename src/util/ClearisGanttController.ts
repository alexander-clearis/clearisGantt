import { ScaleMode } from "./ScaleMode";
import { DayScale, MonthScale, WeekScale, YearScale } from "./TimeScalesHelpers";
import { Timeline } from "./Timeline";
import { iTaskController, mockTaskController } from "./TaskController";

export interface iClearisGanttController {
  readonly scaleModeControllers: ScaleMode[];

  get chartTitle(): string;

  set chartTitle(value: string);

  get timeLine(): Timeline;

  changeScale(newScale: ScaleMode): void;

  get taskController(): iTaskController;

  get viewLength(): number;
  get viewHeigth(): number;

}

export class ClearisGanttController implements iClearisGanttController {
  private _chartTitle: string;
  private _timeLine: Timeline;
  private _taskController: iTaskController;

  private _viewLength: number;
  private _viewHeigth: number;

  readonly scaleModeControllers = [
    new ScaleMode("Day of the week", new WeekScale(), 1, new DayScale()),
    new ScaleMode("Month", new YearScale(), 1, new MonthScale()),
    new ScaleMode("Year", new YearScale(), 1, new MonthScale()),
    new ScaleMode("Year", new YearScale(), 4)
  ];

  constructor(name: string) {
    this._chartTitle = name;
    this._timeLine = new Timeline(this.scaleModeControllers[1], new Date(2019, 0, 1, 3, 0), new Date(2022, 0, 1, 3, 0));
    this._taskController = new mockTaskController();


    this._viewLength = 1500;
    this._viewHeigth = 640;
  }

  get chartTitle(): string {
    return this._chartTitle;
  }

  set chartTitle(value: string) {
    this._chartTitle = value;
  }

  get timeLine(): Timeline {
    return this._timeLine;
  }

  public changeScale(newScale: ScaleMode): void {
    this._timeLine = new Timeline(newScale, this._timeLine.startDate, this._timeLine.endDate);
  }

  get taskController(): iTaskController {
    return this._taskController;
  }


  get viewLength(): number {
    return this._viewLength;
  }

  get viewHeigth(): number {
    return this._viewHeigth;
  }
}

