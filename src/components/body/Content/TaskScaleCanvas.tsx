import React, {Component, createElement, ReactNode} from "react";
import {iTimeline} from "../../../util/ITimeline";
// import {ScaleMarker} from "./TimeScale/ScaleMarker";
import {FriendlyTimeline} from "../../../util/FriendlyTimeline";
import {ScaleMarker} from "./TimeScale/ScaleMarker";


export interface iTaskScaleProps {
    timeline: iTimeline;
}


export class TaskScaleCanvas extends Component<iTaskScaleProps> {
    private friendlyTaskScale: FriendlyTimeline = new FriendlyTimeline(this.props.timeline.scaleMode(), this.props.timeline.singleScaleLength(), this.props.timeline.startDate(), this.props.timeline.endDate())

    // private drawScales(): React.ReactNode[] {
    //     const intervals: ReactNode[] = [];
    //
    //     const scaleType = this.props.timeline.scaleMode().child ?? this.props.timeline.scaleMode().parent;
    //
    //     // const timelinePixellength: number = this.props.timeline.timelinePixelLength();
    //     const scaleTypeOnTimeLine: number = this.props.timeline.calculateScaleTypeApperanceOnThis(scaleType)
    //
    //     let counter = 0;
    //     for (let i = 1; i < scaleTypeOnTimeLine; i++) {
    //         intervals.push(<ScaleMarker date={scaleType.dateByIndex(this.props.timeline.startDate(), i)}
    //                                     scaleType={scaleType}
    //                                     positionOnTimeLine={this.props.timeline.relativePosistion(scaleType.dateByIndex(this.props.timeline.startDate(), i))}/>)
    //         counter = i;
    //     }
    //     console.log(counter);
    //     return intervals;
    // }

    privateRenderFriendly(): React.ReactNode[] {
        const intervals: ReactNode[] = [];

        this.friendlyTaskScale.chartContentScale.forEach(value => {
            intervals.push(<ScaleMarker positionOnTimeLine={value.start.position}
                                        date={value.start.date}/>)
        })

        return intervals
    }

    render() {
        return <div className={"TaskScaleLayer CanvasLayer"}>
            {/* {this.drawScales()} */}
            {this.privateRenderFriendly()}
        </div>;
    }
}