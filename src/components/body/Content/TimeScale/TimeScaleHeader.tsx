import { Component, createElement, ReactNode } from "react";
import { ScaleMode } from "../../../../util/ScaleMode";
import { Timeline } from "../../../../util/Timeline";
import { Interval } from "./Interval";

export interface TimeScaleHeaderProps {
  timeLine: Timeline;
  viewLength: number;
}

export interface TimeScaleHeaderState {
  scaleMode: ScaleMode;
  start: Date;
  end: Date;
}

export class TimeScaleHeader extends Component<TimeScaleHeaderProps> {
  state: TimeScaleHeaderState = {
    scaleMode: this.props.timeLine.scaleMode,
    start: this.props.timeLine.startDate,
    end: this.props.timeLine.endDate
  };


  private renderScale(): ReactNode[] {
    const nodes: ReactNode[] = [];
    console.log("SCALES ON TIME LINE: ", this.props.timeLine.scalesOnTimeLine());
    for (let i = 0; this.state.scaleMode.parent.dateByIndex(this.state.start, i).valueOf() < this.state.end.valueOf(); i++) {
      nodes.push(<Interval width={this.props.viewLength}
                           scaleMode={this.state.scaleMode}
                           date={this.state.scaleMode.parent.dateByIndex(this.state.start, i)} />);
    }
    return nodes;
  }


  constructor(props: TimeScaleHeaderProps) {
    super(props);
  }


  render() {
    return <div className="TimeScale BodyHeader"
                style={{ width: this.props.viewLength * this.props.timeLine.scalesOnTimeLine() }}>
      {
        this.renderScale()
      }
    </div>;
  }
}