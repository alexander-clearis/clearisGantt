import React, {Component, createElement} from "react";
import {Rnd} from "react-rnd";
import {iTask} from "../../../../util/TaskModel";
import {Timeline} from "../../../../util/Timeline";



export interface TaskProps {
    task: iTask;
    timeline: Timeline;
}

export interface TaskState {
    x: number;
    width: number;
}


export class TaskComponent extends Component<TaskProps> {
    state: TaskState;
    readonly ref: React.RefObject<any> = React.createRef();


    constructor(props: Readonly<TaskProps> | TaskProps) {
        super(props);
        this.state = {
            x: this.getOriginalX(),
            width: this.getOriginalWidth(),
        };
    }

    getOriginalX(): number {
        return this.props.timeline.relativePosistion(this.props.task.start);
    }

    getOriginalWidth(): number {
        return this.props.timeline.lengthOnTimeLine(this.props.task.start, this.props.task.end);
    }


    private getDefault(): { x: number, y: number, width: number | string, height: number | string } {
        return {
            x: this.state.x,
            y: 0,
            width: this.state.width,
            height: "100%"
        }
    }

    render() {
        return <div className={"TaskBounds"}>
            <Rnd className={"TaskWrapper"}
                 bounds={"parent"}
                 enableResizing={{left: true, right: true}}
                 default={this.getDefault()}
            >
                <div className={"TaskContainer bg-primary"} ref={this.ref}>
                    <p>{this.props.task.name}</p>
                </div>

            </Rnd>
        </div>;

    }
}
