import {iTimelineController} from "../../controller/TimelineController";
import {TaskController} from "../../controller/TaskController";
import {Component, createElement, Fragment, ReactNode} from "react";
import {Xwrapper} from "react-xarrows";
import {TaskViewWrapper} from "./TaksViewWrapper";
import {iNodeController} from "../../controller/NodeController";

export interface NodeContentProps {
    timeline: iTimelineController
    nodes: iNodeController[]
}

export class NodeContent extends Component<NodeContentProps> {

    renderNodeWithChildren(node: iNodeController): ReactNode {
        const children = node.getChildren();
        if (node instanceof TaskController) {
            return <Fragment>
                <TaskViewWrapper
                    name={node.getName()}
                    id={node.getID()}
                    display={node.display()}
                    displayChildren={node.displayChildren()}
                    size={{
                        start: this.props.timeline.dateToNumber(node.getStart()),
                        end: this.props.timeline.dateToNumber(node.getEnd())
                    }}
                    getMaxBounds={node.getMaxBounds}
                    timeLineLength={this.props.timeline.lengthInPixels()}
                    dayPixelLength={this.props.timeline.dayInPixel()}
                    bindDisplayChildren={node.bindDisplayChildren}
                    ref={node.getViewRef()}

                />
                {
                    (children)?.map(node => this.renderNodeWithChildren(node)) ?? null
                }
            </Fragment>
        }
    }

    render() {
        return (
            <div className={"TaskLayer CanvasLayer"}>
                <Xwrapper>
                    {this.props.nodes.map(parentNode => this.renderNodeWithChildren(parentNode))}
                </Xwrapper>
            </div>
        )
    }


}