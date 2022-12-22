import {iNodeModel, MxNodeModel, NodeModel} from "./NodeModel";
import {MendixGanttFactory} from "./GanttModelFactory";


export interface iTaskModel extends iNodeModel {

}

export abstract class TaskModelBase extends NodeModel implements iTaskModel {
}

export class MxTaskModel extends MxNodeModel {

    constructor(mxObj: mendix.lib.MxObject, factory: MendixGanttFactory, name: string, id: string, start: Date, end: Date, parentID?: string, color?: string) {
        super(mxObj, factory, name, id, start, end, parentID, color);
    }
}
