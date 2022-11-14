import {Component, createElement, ReactNode} from "react";

import {TimeInterval} from "../../../../util/FriendlyTimeline";
import classNames from "classnames";
import {ScaleType} from "../../../../util/ScaleType";
import {iTimeline} from "../../../../util/ITimeline";

export interface TimeScaleHeaderProps {
    timeLine: iTimeline;
}

//
// export interface TimeScaleHeaderState {
//     timeLine: Timeline;
// }

export class TimeScaleHeader extends Component<TimeScaleHeaderProps> {
    // private friendlyTaskScale: FriendlyTimeline = new FriendlyTimeline(this.props.timeLine.scaleMode(), this.props.timeLine.singleScaleLength(), this.props.timeLine.startDate(), this.props.timeLine.endDate())


    constructor(props: TimeScaleHeaderProps) {
        super(props);
    }


    private renderScale(): ReactNode[] {
        const nodes: ReactNode[] = [];

        const parent = this.props.timeLine.scaleMode().parent();
        const child = this.props.timeLine.scaleMode().child()
        if (child) {
            nodes.push(<div className={"IntervalRow Parent"}
                            style={{height: "50%"}}> {this.renderScaleMap(parent, this.props.timeLine.scaleParentMap())}</div>)
            nodes.push(<div className={"IntervalRow Child"}
                            style={{height: "50%"}}> {this.renderScaleMap(child, this.props.timeLine.scaleChildMap(), true)}</div>)
        } else {
            nodes.push(<div className={"IntervalRow Parent"}
                            style={{height: "100%"}}> {this.renderScaleMap(parent, this.props.timeLine.scaleParentMap())}</div>)
        }

        return nodes;

    }

    private renderScaleMap(scaleType: ScaleType, map: Map<number, TimeInterval>, child?: boolean): ReactNode[] {
        const nodes: ReactNode[] = [];
        const classes: string = classNames({
            "IntervalCell": true, "Child": child ?? false
        });
        map.forEach(value => {
            nodes.push(<div className={classes} style={{left: value.start.position, width: value.lengthInPixels + "px"}}>
                <div style={{position: "absolute", left: 0, width: "1px", height: "100%", background: "red"}}> </div>
                {scaleType.dateToIntervalLabel(value.start.date)}
            </div>)
        })
        return nodes
    }

    render() {
        return <div className="TimeScale BodyHeader">
            {
                this.renderScale()
            }
        </div>;
    }
}