import React, {RefObject} from "react";
import {Marker} from "../view/content/Marker";
import {timeXvalue} from "../../util/ExtraTypes";
import {iNodeController} from "./NodeController";

export type SnapPoint = {
    before: timeXvalue,
    after: timeXvalue
}
export type useSnapHelper = {
    getSnapOnDrag: (pos: number) => SnapPoint;
    hideHelper: () => void;
    showSnapHelper: (pos: number) => void;
}

export class SnapController {
    private markerRef: RefObject<Marker> = React.createRef<Marker>();

    private currentCommonTimeXvalues: timeXvalue[] = [];
    private nodes: iNodeController[] = []

    constructor(commonTimeXValues: timeXvalue[], nodes: iNodeController[]) {
        this.currentCommonTimeXvalues = commonTimeXValues
        this.nodes = nodes;
    }

    public newCommonTimeXValues(newValues: timeXvalue []) {
        this.currentCommonTimeXvalues = newValues;
    }

    public getUsageProps(): useSnapHelper {
        return {
            getSnapOnDrag: this.getSnapPoint,
            showSnapHelper: this.showSnapHelper,
            hideHelper: this.hideSnapHelper
        }
    }

    getNodeValues(): timeXvalue[] {
        return this.nodes.filter(node => node.display()).flatMap(value => {
            const nodeS = value.getStartEndView();
            const startD = value.getStart()
            const end = value.getEnd();
            return [{x: nodeS!.start, date: startD}, {x: nodeS!.end, date: end}]
        });
    }

    findClosest(arr: timeXvalue[], pos: number) {
        return arr.reduce(function (prev, curr) {
            return (Math.abs(curr.x - pos) < Math.abs(prev.x - pos) ? curr : prev);
        });

    }

    getSnapPoint = (pos: number): SnapPoint => {
        const availablePoints = this.currentCommonTimeXvalues.concat(this.getNodeValues());
        return {
            before: this.findClosest(availablePoints.filter(value => value.x <= pos), pos),
            after: this.findClosest(availablePoints.filter(value => value.x > pos), pos)
        }
    }

    getMarkerRef(): React.RefObject<Marker> {
        return this.markerRef;
    }

    showSnapHelper = (pos: number): void => {
        this.markerRef.current?.showSnapHelper(pos)
    }

    hideSnapHelper = (): void => {
        this.markerRef.current?.hideMarker();
    }

}

