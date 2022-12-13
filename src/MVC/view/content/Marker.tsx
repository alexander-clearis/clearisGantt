import {Component, createElement} from "react";

export interface TimeMarkerProps {
    pos: number;
    display: boolean;
    className: string;
}

export interface TimeMarkerState {
    pos: number;
    display: boolean;
}

export class Marker extends Component<TimeMarkerProps, TimeMarkerState> {
    state = {
        pos: this.props.pos,
        display: this.props.display
    }

    constructor(props: TimeMarkerProps) {
        super(props);
    }

    componentDidUpdate(prevProps: Readonly<TimeMarkerProps>) {
        if(this.props != prevProps) {
            this.setState({
                pos: this.props.pos
            })
        }
    }

    public showSnapHelper(x: number): void {
        this.setState({pos: x, display: true})
    }

    public hideMarker = (): void => {
        this.setState((prevState) => {
            return {...prevState, display: false}
        })
    }


    public changePos(pos: number): void {
        if (this.state.pos != pos) {
            this.setState({pos: pos})
        }
    }

    render() {
        if (this.state.display) {
            let className = "Marker"
            className += " " + this.props.className;

            return <div
                className={className + " "}
                style={{
                    left: this.state.pos + "px",
                }}
            />
        }
        return null
    }
}
