import { Component, createElement } from "react";
import { iTask } from "../../../../util/Task";
import { Timeline } from "../../../../util/Timeline";
import { Rnd } from "react-rnd";


export interface TaskProps {
  task: iTask;
  timeline: Timeline;
}

export interface TaskState {
  x: number;
  width: number;
}


export class Task extends Component<TaskProps> {
  state: TaskState;

  constructor(props: Readonly<TaskProps> | TaskProps) {
    super(props);
    this.state = {
      x: this.getOriginalX(),
      width: this.getOriginalWidth()
    };
  }

  getOriginalX(): number {
    return this.props.timeline.positionOnTimeline(this.props.task.start);
  }

  getOriginalWidth(): number {
    return this.props.timeline.lengthOnTimeLine(this.props.task.start, this.props.task.end);
  }

  // private getStyle(): React.CSSProperties {
  //   return {left: this.state.x + "%", width: this.state.width + "%", resize:"horizontal" };
  // }

  /*
  private getDefaultParamters(): {
    x: number, y: number, width: number | string, height: number | string
  } {
    return { y: 0, x: this.state.x, width: this.state.width, height: "100%" };
  }
*/

  render() {
    // const style = {
    //   display: "flex",
    //   alignItems: "center",
    //   justifyContent: "center",
    //   border: "solid 1px #ddd",
    //   background: "#f0f0f0"
    // } as const;
    console.log("WERKT NIET");
    return <div className={"TaskBounds"}>
      <Rnd
        style={{background: "blanchedalmond"}}
        default={{
          x: 0,
          y: 0,
          width: "200px",
          height: "50px"
        }}
      >
        Rnd
      </Rnd>


      {/* <div className={"TaskWrapper"} style={this.getStyle()}> */}
      {/*   <p>{this.props.task.name}</p> */}
      {/* /!*  *!/ */}

      {/* </div> */}
    </div>;

  }
}
