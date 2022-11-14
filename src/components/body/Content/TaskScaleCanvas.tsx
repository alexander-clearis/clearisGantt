import React, {Component, createElement, ReactNode} from "react";
// import {ScaleMarker} from "./TimeScale/ScaleMarker";
import {ScaleMarker} from "./TimeScale/ScaleMarker";
import {iTimeline} from "../../../util/ITimeline";


export interface iTaskScaleProps {
    timeline: iTimeline;
}


export class TaskScaleCanvas extends Component<iTaskScaleProps> {

    privateRenderFriendly(): React.ReactNode[] {
        const intervals: ReactNode[] = [];

        this.props.timeline.contentScaleMap().forEach(value => {
            console.log(value.start.position, value.start.date)
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