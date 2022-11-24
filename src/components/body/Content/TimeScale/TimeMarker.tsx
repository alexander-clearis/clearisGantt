import {Component, createElement} from "react";

export interface TimeMarkerProps {
    positionOnTimeLine: number;
    display: boolean;
    className: string;
}

export interface TimeMarkerState {
    positionOnTimeLine: number;
    display: boolean;
}

export class TimeMarker extends Component<TimeMarkerProps, TimeMarkerState> {
    state = {
        positionOnTimeLine: 0,
        display: false
    }

    constructor(props: TimeMarkerProps) {
        super(props);
    }

    public change(x?: number, display?: boolean): void {
        this.setState({positionOnTimeLine: x ?? this.state.positionOnTimeLine, display: display ?? this.state.display})
    }

    public display(display: boolean): void {
        this.setState(
            (prevstate) => {
                return {...prevstate, display: display}
            })
    }


    public changePos(pos: number): void {
        if (this.state.positionOnTimeLine != pos) {

            this.setState(
                {positionOnTimeLine: pos}
                , () => {
                })
        }

    }

    render() {

        if (this.state.display) {
            let className = "TimeMarker"
            className += " " + this.props.className;
            return [<div
                //ref={this.props.ref}
                className={className + " "}
                style={{
                    left: this.state.positionOnTimeLine -1.5 + "px",
                }}
            >
            </div>
                // <button onClick={() => {
                //     this.display(this.state.display!);
                // }}>display</button>
            ]
        }
        return null
        // return <button style={{zIndex: 20}} onClick={() => {
        //     this.display(this.state.display!);
        // }}>display</button>
    }
}
