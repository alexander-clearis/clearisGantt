import React, {Component, createElement, ReactNode} from "react";
import {Timeline} from "../../../util/Timeline";
import {ScaleMarker} from "./TimeScale/ScaleMarker";


export interface iTaskScaleProps {
    timeline: Timeline;
}


export class TaskScaleCanvas extends Component<iTaskScaleProps> {


    private drawScales(): React.ReactNode[] {
        const intervals: ReactNode[] = [];

        const scaleType = this.props.timeline.scaleMode().child ?? this.props.timeline.scaleMode().parent;

        // const timelinePixellength: number = this.props.timeline.timelinePixelLength();
        const scaleTypeOnTimeLine: number = this.props.timeline.calculateScaleTypeApperanceOnThis(scaleType)

        let counter = 0;
        for (let i = 1; i < scaleTypeOnTimeLine; i++) {
            intervals.push(<ScaleMarker date={scaleType.dateByIndex(this.props.timeline.startDate(), i)}
                                        scaleType={scaleType}
                                        positionOnTimeLine={this.props.timeline.relativePosistion(scaleType.dateByIndex(this.props.timeline.startDate(), i))}/>)
            counter = i;
        }
        console.log(counter);
        return intervals;
    }


    render() {
        return <div className={"TaskScaleLayer CanvasLayer"}>
            {this.drawScales()}
        </div>;
    }
}