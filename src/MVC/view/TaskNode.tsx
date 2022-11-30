import {MaxBoundsClearis, NodeViewSize, StartEndClearis} from "../../util/ExtraTypes";
import  {createElement} from "react";
import {Rnd} from "react-rnd";
import {useXarrow} from "react-xarrows";



export interface TaskViewProps {
    nodeSize: NodeViewSize
    name: string
    anchorID: string
    onSizeUpdate: (size: NodeViewSize) => void


    getMaxBounds: () => MaxBoundsClearis
    onDragStart: (startEnd: StartEndClearis) => void;
    onDrag:  (startEnd: StartEndClearis) => void;
    onDragStop:  (startEnd: StartEndClearis) => void
}

export const TaskNode = (props: TaskViewProps) => {
    console.log("TaskNode Render ", props.name)

    useXarrow();



    return <div className={"NodeBounds"}>
        <Rnd className={"TaskWrapper"}
             bounds={"parent"}
             enableResizing={{left: true, right: true}}
             size={{width: props.nodeSize.width, height: "100%"}}
             position={{x: props.nodeSize.x, y: 0}}





        >
            <div id={props.anchorID} className={"TaskContainer bg-primary"}>
                <p>TaskName</p>
            </div>
        </Rnd>
    </div>
}
