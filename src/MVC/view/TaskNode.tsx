import {MaxBoundsClearis, NodeViewSize} from "../../util/ExtraTypes";
import {createElement, useState} from "react";
import {DraggableData, Rnd} from "react-rnd";
import {useXarrow} from "react-xarrows";



export interface TaskViewProps {
    nodeSize: NodeViewSize
    name: string
    anchorID: string
    onSizeUpdate: (size: NodeViewSize) => void
    getMaxBounds: () => MaxBoundsClearis

}

export const TaskNode = (props: TaskViewProps) => {
    console.log("TaskNode Render ", props.name)
    const updateArrows = useXarrow();
    let maxBounds = props.getMaxBounds();

    const [nodeSizeX, setNodeSizeX] = useState<number>(props.nodeSize.x)
    const [nodeSizeWidth, _setNodeSizeWidth] = useState<number>(props.nodeSize.width)

    const updateMaxBounds = (): void => {
        maxBounds = props.getMaxBounds();
    }
    const forceBoundsOnDrag = (data: DraggableData): void => {
        if(maxBounds.StartMin && data.x < maxBounds.StartMin) {
            setNodeSizeX(maxBounds.StartMin)
        } else if (maxBounds.StartMax && data.x > maxBounds.StartMax) {
            setNodeSizeX(maxBounds.StartMax)
        }else if(maxBounds.EndMin && data.x < maxBounds.EndMin - props.nodeSize.width) {
            setNodeSizeX(maxBounds.EndMin - props.nodeSize.width)
        } else if(maxBounds.EndMax && data.x > maxBounds.EndMax - props.nodeSize.width) {
            setNodeSizeX(maxBounds.EndMax - props.nodeSize.width)
        }
    }
    // onDragStart: (startEnd: StartEndClearis) => void;
    // onDrag:  (startEnd: StartEndClearis) => void;
    // onDragStop:  (startEnd: StartEndClearis) => void



    return <div className={"NodeBounds"}>
        <Rnd className={"TaskWrapper"}
             bounds={"parent"}
             enableResizing={{left: true, right: true, top: false, bottom: false}}
             size={{width: nodeSizeWidth, height: "100%"}}
             position={{x: nodeSizeX, y: 0}}
             onDragStart={ () => {
                 updateMaxBounds();
                 //    todo: use snap helper


                 updateArrows()

             }}
             onDrag={ (_e, data) => {
                 forceBoundsOnDrag(data);
             // todo: updateSnapHelper


                 updateArrows()
             }}
             onDragStop={ (_e, data) => {
                 forceBoundsOnDrag(data)
                 props.onSizeUpdate({x: nodeSizeX, width: nodeSizeWidth})
                 updateArrows()
             }}






        >
            <div id={props.anchorID} className={"TaskContainer bg-primary"}>
                <p>TaskName</p>
            </div>
        </Rnd>
    </div>
}
