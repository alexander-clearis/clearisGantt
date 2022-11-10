import {Component, createElement} from "react";

export interface ScaleMarkerProps {
    positionOnTimeLine: number;
    date: Date;
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
