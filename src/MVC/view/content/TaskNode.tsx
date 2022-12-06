import {MaxBoundsClearis, NodeViewSize} from "../../../util/ExtraTypes";
import {createElement, useState} from "react";
import {Rnd} from "react-rnd";
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
    const [nodeSizeX, _setNodeSizeX] = useState<number>(props.nodeSize.x)
    const [nodeSizeWidth, _setNodeSizeWidth] = useState<number>(props.nodeSize.width)


    // onDragStart: (startEnd: StartEndClearis) => void;
    // onDrag:  (startEnd: StartEndClearis) => void;
    // onDragStop:  (startEnd: StartEndClearis) => void


    return <div className={"NodeBounds"}>
        <Rnd className={"TaskWrapper"}
             parent
             enableResizing={{left: true, right: true, top: false, bottom: false}}
             size={{width: nodeSizeWidth, height: "100%"}}
             position={{x: nodeSizeX, y: 0}}
             dragGrid={[4, 4]}
             dragAxis={"x"}

             onDragStart={() => {
                 //     //    todo: use snap helper
                 // updateArrows()

             }}
             onDrag={(_e, _data) => {
                 // forceBoundsOnDrag(_data);
                 // todo: updateSnapHelper
                 //     updateArrows()
             }}
             onDragStop={(_e, _data) => {
                 // forceBoundsOnDrag(data);
                 _setNodeSizeX(_data.x)
                 props.onSizeUpdate({x: nodeSizeX, width: nodeSizeWidth})
                 updateArrows()
             }}


        >
            <div id={props.anchorID} className={"TaskContainer bg-primary"}>
                <p>{props.name}</p>
                <p>x = {props.nodeSize.x}</p>
                <p>width = {props.nodeSize.width}</p>
            </div>
        </Rnd>
    </div>
}
