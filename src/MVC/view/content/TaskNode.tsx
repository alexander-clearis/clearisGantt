import {MaxBoundsClearis, NodeViewSize} from "../../../util/ExtraTypes";
import React, {createElement, useState} from "react";
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
    const rndRef: React.RefObject<Rnd> = React.createRef<Rnd>()

    // @ts-ignore
    let maxBounds = props.getMaxBounds();
    const updateMaxBounds = () => maxBounds = props.getMaxBounds();
    // onDragStart: (startEnd: StartEndClearis) => void;
    // onDrag:  (startEnd: StartEndClearis) => void;
    // onDragStop:  (startEnd: StartEndClearis) => void
    const doSMt = (): void => {
        rndRef.current?.updatePosition({x: 0, y: 0})
        rndRef.current?.updatePosition({x: 0, y: 0})
        rndRef.current?.updatePosition({x: 0, y: 0})
    }
    return <div className={"NodeBounds"}>
        <Rnd className={"TaskWrapper"}
             ref={rndRef}
             enableResizing={{left: true, right: true, top: false, bottom: false}}
             size={{width: nodeSizeWidth, height: "100%"}}
             position={{x: nodeSizeX, y: 0}}

             dragAxis={"x"}

             onDragStart={() => {
                 updateMaxBounds();
                 doSMt()
                 //     //    todo: use snap helper
                 // updateArrows()
                 //    https://www.google.com/search?q=while+draggin+set+posoition+ReactRND&rlz=1C1ONGR_nlNL956NL956&oq=while+draggin+set+posoition+ReactRND&aqs=chrome..69i57j33i10i160l3.7231j0j7&sourceid=chrome&ie=UTF-8

             }}
             onDrag={(_e, _data) => {
                 doSMt()
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
