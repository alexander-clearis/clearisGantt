import {iTimelineController} from "../../controller/TimelineController";
import {iNodeController, TaskController} from "../../controller/TaskController";
import {Component, createElement} from "react";
import {Xwrapper} from "react-xarrows";
import {TaskViewWrapper} from "./TaksViewWrapper";

export interface NodeContentProps {
    timeline: iTimelineController
    nodes: iNodeController[]
}

export class NodeContent extends Component<NodeContentProps> {


    render() {
        return (
            <div className={"TaskLayer CanvasLayer"}>
                <Xwrapper>
                    {
                        this.props.nodes.map(node => {
                            if (node instanceof TaskController) {
                                return <TaskViewWrapper
                                    name={node.getName()}
                                    id={node.getID()}
                                    display={true}
                                    size={{start: this.props.timeline.dateToNumber(node.getStart()), end: this.props.timeline.dateToNumber(node.getEnd())}}
                                    getMaxBounds={node.getMaxBounds}
                                />
                            }

                        })

                    }
                </Xwrapper>
            </div>
        )
    }


}