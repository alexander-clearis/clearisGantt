import {iNodeViewWrapper, NodeViewWrapperProps, NodeViewWrapperState} from "./__viewNode";
import {Component, createElement, ReactNode} from "react";
import {NodeViewSize, StartEndViewClearis, timeXvalue} from "../../../util/ExtraTypes";
import Xarrow from "react-xarrows";

export abstract class NodeViewWrapper<P extends NodeViewWrapperProps, S extends NodeViewWrapperState> extends Component<P, S> implements iNodeViewWrapper {
    constructor(props: P) {
        super(props);
    }

    protected readonly anchorID = "NodeAnchor-" + this.props.id;

    public getAnchorID(): string {
        return this.anchorID
    };

    public getStartEnd(): StartEndViewClearis {
        return {
            start: this.state.nodeSize.x,
            end: this.state.nodeSize.x + this.state.nodeSize.width
        }
    };

    private propsUpDateSize(): boolean {
        return !(this.props.size.start === this.state.nodeSize.x && this.state.nodeSize.x + this.state.nodeSize.width === this.props.size.end);
    }

    componentDidUpdate(prevProps: Readonly<P>,) {
        if (prevProps.size != this.props.size) {
            if (this.propsUpDateSize()) {
                this.setState({
                    nodeSize: {
                        x: this.props.size.start,
                        width: this.props.size.end - this.props.size.start
                    }
                })
            }
        }
    }

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
        this.props.previewDragChildren(0);
        if (timeXValue.x != this.state.nodeSize.x) {
            const maxBoundsR = this.props.getMaxBounds().EndMaxR
            if (maxBoundsR && timeXValue.x + this.state.nodeSize.width >= maxBoundsR.x) {
                this.props.updateOnDrag(this.props.numberToDate(maxBoundsR.x - this.state.nodeSize.width))
            } else {
                this.props.updateOnDrag(timeXValue.date);
            }

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

    private renderChildConnections(): ReactNode {
        return this.props.getChildControllers()?.map((child) => <Xarrow start={this.anchorID} end={child.getAnchorID()} startAnchor={"left"} endAnchor={"left"} path={"grid"} dashness={true} />);
    };

    public render() {
        if (this.state.display) {

            return <div className={"NodeBounds"}>
                {this.renderNode()}
                {(this.state.displayChildren) ? this.renderChildConnections(): undefined}
            </div>
        } else {
            return null;
        }
    }
}