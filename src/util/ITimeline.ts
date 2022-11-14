import {ScaleMode} from "./ScaleMode";
import {TimeInterval} from "./FriendlyTimeline";

export interface iTimeline {

    timelinePixelLength(): number;
    lengthOnTimeLine(startDate: Date, endDate: Date): number;
    //getParentIntervalOnTimeline(): number;
    relativePosition(date: Date): number;
    snapToScale(pos: number): TimeInterval;
    scaleMode(): ScaleMode
    startDate(): Date;
    endDate(): Date;
    contentScaleMap(): Map<number, TimeInterval>
    scaleParentMap(): Map<number, TimeInterval>;
    scaleChildMap(): Map<number, TimeInterval>
}
