import {Component, createElement, ReactNode} from "react";

import {FriendlyTimeline, TimeInterval} from "../../../../util/FriendlyTimeline";
import classNames from "classnames";
import {ScaleType} from "../../../../util/ScaleType";

export interface TimeScaleHeaderProps {
    timeLine: FriendlyTimeline;
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

        // for (let i = 0; this.props.timeLine.scaleMode().parent.dateByIndex(this.props.timeLine.startDate(), i).valueOf() < this.props.timeLine.endDate().valueOf(); i = i + this.props.timeLine.scaleMode().parent_in_view) {
        //     nodes.push(<Scale width={this.props.timeLine.singleScaleLength()}
        //                       scaleMode={this.props.timeLine.scaleMode()}
        //                       date={this.props.timeLine.scaleMode().parent.dateByIndex(this.props.timeLine.startDate(), i)}/>);
        // }
        const parent = this.props.timeLine.scaleMode().parent();
        const child = this.props.timeLine.scaleMode().child()
        if (child) {
            nodes.push(<div className={"IntervalRow Parent"}
                            style={{height: "50%"}}> {this.renderScaleMap(parent, this.props.timeLine.ScaleHeaderParent)}</div>)
            nodes.push(<div className={"IntervalRow Child"}
                            style={{height: "50%"}}> {this.renderScaleMap(child, this.props.timeLine.ScaleHeaderChild, true)}</div>)
        } else {
            nodes.push(<div className={"IntervalRow Parent"}
                            style={{height: "100%"}}> {this.renderScaleMap(parent, this.props.timeLine.ScaleHeaderParent)}</div>)
        }

        return nodes;

    }

    private renderScaleMap(scaleType: ScaleType, map: Map<number, TimeInterval>, child?: boolean): ReactNode[] {
        const nodes: ReactNode[] = [];
        const classes: string = classNames({
            "IntervalCell": true, "Child": child ?? false
        });
        map.forEach(value => {
            nodes.push(<div className={classes} style={{width: value.lengthInPixels + "px"}}>
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