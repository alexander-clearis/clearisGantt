import {iTimelineController} from "../../controller/TimelineController";
import {TaskController} from "../../controller/TaskController";
import {Component, createElement, Fragment, ReactNode} from "react";
import {Xwrapper} from "react-xarrows";
import {TaskViewWrapper} from "./TaksViewWrapper";
import {iNodeController} from "../../controller/NodeController";
import {Marker} from "./Marker";
import {SnapController} from "../../controller/SnapController";

export interface NodeContentProps {
    timeline: iTimelineController
    snapController: SnapController;
    nodes: iNodeController[]
}

export class NodeContent extends Component<NodeContentProps> {

    renderNodeWithChildren(node: iNodeController): ReactNode {
        const children = node.getChildren();
        if (node instanceof TaskController) {
            return <Fragment>
                    <TaskViewWrapper
                        timeLineLength={this.props.timeline.lengthInPixels()}
                        dayPixelLength={this.props.timeline.dayInPixel()}
                        dateToNumber={this.props.timeline.dateToNumber}
                        numberToDate={this.props.timeline.numberToDate}
                        snapController={this.props.snapController.getUsageProps()}


                        size={{
                            start: this.props.timeline.dateToNumber(node.getStart()),
                            end: this.props.timeline.dateToNumber(node.getEnd())
                        }}
                        name={node.getName()}
                        id={node.getID()}
                        display={node.display()}
                        displayChildren={node.displayChildren()}
                        getMaxBounds={node.getMaxBounds}
                        ref={node.getViewRef()}
                        updateOnDrag={node.updateOnDrag}
                        updateOnResize={node.updateOnResize}
                        previewDragChildren={node.previewDragChildren}
                        bindDisplayChildren={node.bindDisplayChildren}

                        getFirstChild={node.getFirstChild}
                        getLastChild={node.getFirstChild}
                    />
                {
                    (children)?.map(node => this.renderNodeWithChildren(node)) ?? null
                }

            </Fragment>
        }
    }


    renderMarkers(): ReactNode {
        // const today = new Date()
        return (<Fragment>
                <Marker className={"SnapHelper"} display={false} ref={this.props.snapController.getMarkerRef()}
                        pos={200}/>
                {

                    // (today.valueOf() > this.props.timeline.startDate().valueOf() && today.valueOf() < this.props.timeline.endDate().valueOf())
                    //     ? <Marker pos={this.props.timeline.dateToNumber(today)} display={true}
                    //               className={"Today"}/> : null
                }


            </Fragment>
        )
    }

    render() {
        return (
            <div className={"NodeContent"} style={{width: this.props.timeline.lengthInPixels() + "px"}}>
                <Xwrapper>
                    {this.renderMarkers()}
                    {this.props.nodes.map(parentNode => this.renderNodeWithChildren(parentNode))}
                </Xwrapper>
            </div>
        )
    }


}