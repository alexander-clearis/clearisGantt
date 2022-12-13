import {Component, createElement, ReactNode} from "react";
import {iTimelineController} from "../../controller/TimelineController";
import {scaleProps} from "../../../util/ExtraTypes";
import {ScaleType} from "../../controller/scale/ScaleType";

export interface ContentScaleProps {

    timeline: iTimelineController;
}
export class ContentScaleBody extends Component<ContentScaleProps> {
    renderScale(): ReactNode[] {
        const intervals: ReactNode[] = [];

        this.props.timeline.getRelativeScaleMap().forEach(value => {
            intervals.push(<ScaleMarker positionOnTimeLine={value.start.x}/>)
        })
        return intervals
    }


    render() {
        return <div className={"TaskScaleLayer ContentLayer"}>
            {this.renderScale()}
        </div>;
    }
}
export class ContentScaleHeader extends Component<ContentScaleProps> {

    renderContentScaleHeader(): ReactNode {
        const nodes: ReactNode[] = [];

        const scaleMode = this.props.timeline.getScaleMode()
        const parentScaleMap = this.props.timeline.getParentScaleMap()
        const childScaleMap = this.props.timeline.getChildScaleMap()
        const hasChild = childScaleMap != undefined;

        nodes.push(<div className={"IntervalRow Parent"}
                        style={{height: hasChild ? "50%" : "100%"}}> {this.renderScaleMap(scaleMode.parent(), parentScaleMap)}</div>)
        if (hasChild) {
            nodes.push(<div className={"IntervalRow Child"}
                            style={{height: "50%"}}> {this.renderScaleMap(scaleMode.child()!, childScaleMap)}</div>)
        }
        return nodes;
    }

    renderScaleMap(scaleType: ScaleType, scaleProps: scaleProps[]): ReactNode {
        const nodes: ReactNode[] = [];
        scaleProps.forEach(scaleProp => {
            nodes.push(
                <div className={"IntervalCell"}
                     style={{left: scaleProp.start.x, width: scaleProp.end.x - scaleProp.start.x + "px"}}>
                    <div style={{position: "absolute", left: 0, width: "1px", height: "100%", background: "lightgrey"}}></div>
                    {scaleType.dateToIntervalLabel(scaleProp.start.date)}
                </div>
            )


        })
        return nodes;
    }

    render() {
        return (
            <div className="TimeScale ContentHeader" style={{width: this.props.timeline.lengthInPixels() + "px"}}>
                {this.renderContentScaleHeader()}
            </div>
        );
    }
}

export interface ScaleMarkerProps {
    positionOnTimeLine: number;
}

export class ScaleMarker extends Component<ScaleMarkerProps> {


    render() {
        return <div
            className={"ScaleMarker"}
            style={{
                left: this.props.positionOnTimeLine
            }}

        />;
    }
}