import { Component, createElement, ReactNode } from "react";
import { ScaleMode } from "../../../../util/ScaleMode";
import { Timeline } from "../../../../util/Timeline";
import { Scale } from "./Scale";

export interface TimeScaleHeaderProps {
  timeLine: Timeline;
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
    for (let i = 0; this.state.scaleMode.parent.dateByIndex(this.state.start, i).valueOf() < this.state.end.valueOf(); i = i+ this.props.timeLine.scaleMode.parent_in_view) {
      nodes.push(<Scale width={this.props.timeLine.singleScaleLength}
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
                style={{ width: this.props.timeLine.timelinePixelLength()+"px" }}>
      {
        this.renderScale()
      }
    </div>;
  }
}