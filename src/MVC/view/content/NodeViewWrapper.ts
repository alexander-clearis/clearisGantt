import {iNodeViewWrapper, NodeViewWrapperProps, NodeViewWrapperState} from "./__viewNode";
import {Component, ReactNode} from "react";
import {NodeViewSize, StartEndClearis, timeXvalue} from "../../../util/ExtraTypes";

export abstract class NodeViewWrapper<P extends NodeViewWrapperProps, S extends NodeViewWrapperState> extends Component<P, S> implements iNodeViewWrapper {
    protected readonly anchorID = "NodeAnchor-" + this.props.id;

    public getAnchorID(): string {
        return this.anchorID
    };

    public getStartEnd(): StartEndClearis {
        return {
            start: this.state.nodeSize.x,
            end: this.state.nodeSize.x + this.state.nodeSize.width
        }
    };

    updateStartEndDate(start: Date, end: Date): void {
        this.setState({
            nodeSize: {
                x: this.props.dateToNumber(start),
                width: this.props.dateToNumber(start, end)
            },
            deltaShift: 0
        })
    }


    public viewShift(delta: number): void {
        this.setState((prevState) => {
            return {
                ...prevState, deltaShift: delta
            }
        })
    }


    onDrag = (newPos: number): void => {
        this.props.previewDragChildren((newPos - this.state.nodeSize.x));
    }

    onDragStop = (timeXValue: timeXvalue): void => {
        console.log("DRAGSTOP")
        this.props.previewDragChildren(0);
        if (timeXValue.x != this.state.nodeSize.x) {
            this.props.updateOnDrag(timeXValue.date);
        } else {
            this.onClickDisplayChildren()
        }
    }

    onClickDisplayChildren = (): void => {
        this.setState((prevState) => {
            this.props.bindDisplayChildren(!prevState.displayChildren);
            return {
                ...prevState, displayChildren: !prevState.displayChildren
            }
        }, () => {
        })
    }

    display(value: boolean): void {
        this.setState({display: value})
    }

    protected getNodeSize(): NodeViewSize {
        return {
            x: this.state.deltaShift + this.state.nodeSize.x,
            width: this.state.nodeSize.width
        }
    }

    protected abstract renderNode(): ReactNode;

    public render() {
        if (this.state.display) {
            return this.renderNode();
        } else {
            return null;
        }
    }
}