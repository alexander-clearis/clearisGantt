import {iMxNodeModel, MxNodeModel} from "./NodeModel";
import {getReferencePart} from "@jeltemx/mendix-react-widget-utils";
import {MxTaskModel} from "./TaskModel";
import {iNodeController} from "../controller/NodeController";
import {TaskController} from "../controller/TaskController";



export class MendixGanttFactory {
    private mxNodeModels: MxNodeModel[] = [];

    public commit(): void {
        mx.data.commit(
            {
                mxobjs: this.mxNodeModels.map(m => m.getMxObj()),
                callback: () => {
                }
            }
        )
    }

    private nodeNameAttribute: string
    private nodeStartAttribute: string
    private nodeEndAttribute: string
    private nodeParentRefAttribute?: string
    private nodeColorAttribute?: string
    private onClick: (mxObj: mendix.lib.MxObject) => void

    getNodeStartAttribute(): string {
        return this.nodeStartAttribute
    }

    getNodeEndAttribute(): string {
        return this.nodeEndAttribute
    }


    constructor(onClick: (mxObj: mendix.lib.MxObject) => void, nodeNameAttribute: string, nodeStartAttribute: string, nodeEndAttribute: string, nodeParentRefAttribute?: string, nodeColorAttribute?: string) {
        this.nodeNameAttribute = nodeNameAttribute;
        this.nodeStartAttribute = nodeStartAttribute;
        this.nodeEndAttribute = nodeEndAttribute;
        this.nodeParentRefAttribute = nodeParentRefAttribute ? getReferencePart(nodeParentRefAttribute) : undefined;
        this.nodeColorAttribute = nodeColorAttribute;
        this.onClick = onClick;
    }

    public factorParentId(mxObj: mendix.lib.MxObject): string | undefined {
        if (this.nodeParentRefAttribute) {
            const r = mxObj.get(this.nodeParentRefAttribute)
            if (r == "") {
                return undefined
            } else {
                return r as string
            }
        } else {
            return undefined
        }
    }

    public factorTaskModels(objs: mendix.lib.MxObject[]): this {
        this.mxNodeModels.push(
            ...objs.map(mxObj => {
                return new MxTaskModel(
                    mxObj,
                    this,
                    mxObj.get(this.nodeNameAttribute) as string,
                    mxObj.getGuid(),
                    new Date(mxObj.get(this.nodeStartAttribute) as number),
                    new Date(mxObj.get(this.nodeEndAttribute) as number),
                    this.factorParentId(mxObj),
                    this.nodeColorAttribute ? mxObj.get(this.nodeColorAttribute) as string : undefined
                )
            })
        )
        return this
    }

    public factorRootNodes(): iNodeController[] {
        return this.factorNodeControllers(this.mxNodeModels.filter(model => model.getParentID() === undefined))
    }

    public factorNodeControllers(models: iMxNodeModel[]): iNodeController[] {
        return models.map(model => {
            if (model instanceof MxTaskModel) {

                return this.factorTaskController(model)
            }
            return this.factorTaskController(model as MxTaskModel);
        });
    }

    public factorTaskController(taskModel: MxTaskModel): TaskController {
        return new TaskController(taskModel, () => {
            this.onClick(taskModel.getMxObj())
        }, this.factorNodeControllers(this.getChildModels(taskModel)))
    }

    public getChildModels(parent: iMxNodeModel): iMxNodeModel[] {
        return this.mxNodeModels.filter(child => child.getParentID() === parent.getID())
    }

}