import React, {Component, createElement, ReactNode} from "react";
import {ScaleMarker} from "./TimeScale/ScaleMarker";
import {iTimeline} from "../../../util/ITimeline";


export interface iTaskScaleProps {
    timeline: iTimeline;
}


export class TaskScaleCanvas extends Component<iTaskScaleProps> {


    renderScale(): React.ReactNode[] {
        const intervals: ReactNode[] = [];

        this.props.timeline.contentScaleMap().forEach(value => {
            intervals.push(<ScaleMarker positionOnTimeLine={value.start.position}/>)
        })

        return intervals
    }



    render() {
        return <div className={"TaskScaleLayer CanvasLayer"}>
            {this.renderScale()}
        </div>;
    }
}