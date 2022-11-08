import {Component, createElement, ReactNode} from "react";
import {Timeline} from "../../../../util/Timeline";
import {Scale} from "./Scale";

export interface TimeScaleHeaderProps {
    timeLine: Timeline;
}
//
// export interface TimeScaleHeaderState {
//     timeLine: Timeline;
// }

export class TimeScaleHeader extends Component<TimeScaleHeaderProps> {



    constructor(props: TimeScaleHeaderProps) {
        super(props);
        // this.props = {
        //     timeLine: this.props.timeLine,
        // };
    }


    private renderScale(): ReactNode[] {
        const nodes: ReactNode[] = [];
        console.log(this.props.timeLine)
        for (let i = 0; this.props.timeLine.scaleMode().parent.dateByIndex(this.props.timeLine.startDate(), i).valueOf() < this.props.timeLine.endDate().valueOf(); i = i + this.props.timeLine.scaleMode().parent_in_view) {
            nodes.push(<Scale width={this.props.timeLine.singleScaleLength()}
                              scaleMode={this.props.timeLine.scaleMode()}
                              date={this.props.timeLine.scaleMode().parent.dateByIndex(this.props.timeLine.startDate(), i)}/>);
        }
        return nodes;
    }

    render() {
        return <div className="TimeScale BodyHeader"
                    style={{width: this.props.timeLine.timelinePixelLength() + "px"}}>
            {
                this.renderScale()
            }
        </div>;
    }
}