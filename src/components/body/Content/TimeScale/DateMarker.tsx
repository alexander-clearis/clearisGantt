import {Component, createElement} from "react";
import {Timeline} from "../../../../util/Timeline";

export interface DateMarkerProps {
    timeLine: Timeline
    colour: string;
    date: Date;
}

export class DateMarker extends Component<DateMarkerProps> {

    calcPositionLeft(): number {
        console.log(this.props.timeLine.abosolutePosition(this.props.date), this.props.date)
        return this.props.timeLine.abosolutePosition(this.props.date);
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