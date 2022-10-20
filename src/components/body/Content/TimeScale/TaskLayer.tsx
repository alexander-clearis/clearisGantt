import React, {Component, createElement, ReactNode} from "react";
import {propsGCService} from "../../../../util/propsGCService";
import {TaskComponent} from "../Tasks/TaskComponent";
import {TaskConnector} from "../Tasks/TaskConnector";
import Xarrow, {Xwrapper} from "react-xarrows";


export interface TaskLayerProps extends propsGCService {
    zIndex: number;
}

interface propsss {
    position_x: number
    position_y: number
    // id: string
}

class Box extends Component<propsss> {
    render() {
        return <div style={{
            background: "blue",
            position: "absolute",
            left: this.props.position_x,
            bottom: this.props.position_y,
            width: "50px",
            height: "50px"
        }}></div>;
    }
}

export class TaskLayer extends Component<TaskLayerProps> {

    refA: React.RefObject<any> = React.createRef();
    refB: React.RefObject<any> = React.createRef();

    renderTasks(): ReactNode[] {
        return this.props.GC_Service.taskController.getTasks().map(value =>
            <TaskComponent task={value}
                           timeline={this.props.GC_Service.timeLine}
            />);
    }

    renderConnections(): ReactNode[] {
        return this.props.GC_Service.taskController.getConnections().map(value => <TaskConnector
            taskConnection={value}
        />)
    }

    render() {
        return <div className={"TaskLayer CanvasLayer"} style={{zIndex: this.props.zIndex}}>
            {/* {this.renderTasks()} */}
            {/* {this.renderConnections()} */}

            <div style={{
                width: "1000px",
                position: "relative",
                height: "500px",
                border: "1px solid red"
            }}>
                <Xwrapper>
                    <Box ref={this.refA} position_x={0} position_y={0}> </Box>
                    <Box ref={this.refB} position_x={500} position_y={300}> </Box>
                    <Xarrow start={this.refB} end={this.refA}></Xarrow>
                </Xwrapper>
            </div>

        </div>;
    }
}
