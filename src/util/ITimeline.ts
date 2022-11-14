import {ScaleMode} from "./ScaleMode";
import {SnapPoint, TimeInterval} from "./FriendlyTimeline";

export interface iTimeline {

    timelinePixelLength(): number;
    lengthOnTimeLine(startDate: Date, endDate: Date): number;
    //getParentIntervalOnTimeline(): number;
    relativePosition(date: Date): number;
    findNearestSnap(pos: number): SnapPoint;
    scaleMode(): ScaleMode
    startDate(): Date;
    endDate(): Date;
    contentScaleMap(): Map<number, TimeInterval>
    scaleParentMap(): Map<number, TimeInterval>;
    scaleChildMap(): Map<number, TimeInterval>
}
