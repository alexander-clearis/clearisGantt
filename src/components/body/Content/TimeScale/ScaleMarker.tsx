import {Component, createElement} from "react";
import {ScaleType} from "../../../../util/ScaleType";

export interface ScaleMarkerProps {
    positionOnTimeLine: number;
    date: Date;
    scaleType: ScaleType;
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
