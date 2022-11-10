import { Component, createElement, ReactNode } from "react";
import classNames from "classnames";
import { ScaleMode } from "../../../../util/ScaleMode";


export interface IntervalHeaderProps {
  width: number;
  scaleMode: ScaleMode;
  date: Date;
}

export class Scale extends Component<IntervalHeaderProps> {
  constructor(props: IntervalHeaderProps, context: any) {
    super({
      width: props.width,
      scaleMode: props.scaleMode,
      date: props.scaleMode.parent().floorDate(props.date)
    }, context);
  }


  private calcEndInterval(): Date {
    return new Date(this.props.scaleMode.parent().ceilDate(this.props.scaleMode.parent().dateByIndex(this.props.date, this.props.scaleMode.parent_in_view() - 1)));
  }

  private calcChildInInteval(): number {
    const iStart: Date = new Date(this.props.date);
    const iEnd: Date = this.calcEndInterval();
    let counter: number = 0;

    const hasChild = this.props.scaleMode.child();
    if (hasChild) {
      while (hasChild.dateByIndex(iStart, counter).valueOf() < iEnd.valueOf()) {
        counter++;
      }
    }
    return counter;
  }

  render() {
    const rowHeight = this.props.scaleMode.child() ? 50 : 100;

    return <div className={"Interval"} style={{width: this.props.width}}>
      <div className={"IntervalRow Parent"} style={{ height: rowHeight + "%" }}>
        {this.renderParentRow()}
      </div>
      {this.props.scaleMode.child() ?
        <div className={"IntervalRow Child"} style={{ height: rowHeight + "%" }}>
          {this.renderChildRow()}
        </div> : null}
    </div>;
  }

  private renderChildRow(): ReactNode[] {
    const nodes: ReactNode[] = [];
    const scale = this.props.scaleMode.child();
    if (scale) {
      const classes: string = classNames({
        "IntervalCell": true, "Child": true
      });

      const render_x_times = this.calcChildInInteval();
      const width = (1 / render_x_times) * 100;
      for (let i = 0; i < render_x_times; i++) {
        nodes.push(
          <div className={classes} style={{ width: width + "%" }}>
            {scale.dateToIntervalLabel(scale.dateByIndex(this.props.date, i))}
          </div>
        );
      }
    }
    return nodes;
  }


  private renderParentRow(): ReactNode[] {
    const nodes: ReactNode[] = [];
    const classes: string = classNames({
      "IntervalCell": true, "Parent": true
    });
    const render_x_times = this.props.scaleMode.parent_in_view();
    const width = this.props.width / render_x_times;

    console.log("width = ", width)
    for (let i = 0; i < render_x_times; i++) {
      nodes.push(
        <div className={classes} style={{ width: width + "px" }}>
          {this.props.scaleMode.parent().dateToIntervalLabel(this.props.scaleMode.parent().dateByIndex(this.props.date, i))}
        </div>
      );
    }
    return nodes;
  }
}