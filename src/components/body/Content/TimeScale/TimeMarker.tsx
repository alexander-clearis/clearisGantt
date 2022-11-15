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


    constructor(props: TimeMarkerProps) {
        super(props);
        this.state = {
            positionOnTimeLine: 0,
            display: true
        }
    }

    public change(x?: number, display?: boolean): void {
        this.setState({positionOnTimeLine: x ?? this.state.positionOnTimeLine, display: display ?? this.state.display})
    }

    public display(display: boolean): void {
        this.setState({display: display})
    }

    private changePosState(prevstate: TimeMarkerState, newPos: number): TimeMarkerState {
        return {
            ...prevstate, positionOnTimeLine: newPos
        }
    }

    public changePos(pos: number): void {
        console.log("WTF?")
        console.log("new pos: ", pos, this.changePosState(this.state, 80))
        this.setState(this.changePosState(this.state, pos))
        console.log("this is directly after", this.state.positionOnTimeLine)
    }

    componentDidMount() {
        this.setState(this.changePosState(this.state, 80))
        console.log()

    }

    render() {
        console.log("renderrrrr")
        if (this.state.display) {
            let className = "TimeMarker"
            className += " " + this.props.className;
            return <div
                //ref={this.props.ref}
                className={className + " "}
                style={{
                    left: this.state.positionOnTimeLine - 2 + "px",
                }}
            >
                <button style={{zIndex: 20}} onClick={() => this.changePos(20)}></button>
            </div>;
        }
        return null
    }
}
