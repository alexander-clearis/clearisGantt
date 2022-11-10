import {Component, createElement} from "react";
import {iTimeline} from "../../../../util/ITimeline";

export interface DateMarkerProps {
    timeLine: iTimeline
    colour: string;
    date: Date;
}

export class DateMarker extends Component<DateMarkerProps> {

    calcPositionLeft(): number {
        return 0;
        // console.log(this.props.timeLine.abosolutePosition(this.props.date), this.props.date)
        // return this.props.timeLine.abosolutePosition(this.props.date);
    }

    render() {
        return <div
            className={"DateMarker"}
            style={{
                top: 0,
                left: this.calcPositionLeft(),
                background: this.props.colour
            }}

        />;
    }
}