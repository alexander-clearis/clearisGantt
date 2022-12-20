export interface iGanttNode {
    getName(): string;

    getID(): string;

    getStart(): Date;

    setStart(newStart: Date): void;

    getEnd(): Date;

    setEnd(newEnd: Date): void;

    setStartEnd(newStart: Date, newEnd: Date): void;

    onUpdate(): void;

    addSubscribeOnChange(onChange: (newStart: Date, newEnd: Date) => void): void
}


export interface iTaskModel extends iGanttNode {
    getEnd(): Date;

    setEnd(newEnd: Date): void;

    getColor(): string | undefined;
}

export abstract class TaskModelBase implements iTaskModel {
    protected name: string;
    protected id: string;
    protected start: Date;
    protected end: Date;
    protected color?: string

    protected static regexColor: RegExp = /^#([A-F0-9]{3}|[A-F0-9]{6})$/i;

    protected static stringIsColor(string: string): boolean {
        return this.regexColor.test(string)
    }

    protected onChangeSubscriptions: ((newStart: Date, newEnd: Date) => void)[] = [];

    public addSubscribeOnChange(onChange: (newStart: Date, newEnd: Date) => void) {
        this.onChangeSubscriptions.push(onChange)
    }

    protected callSubs(): void {
        this.onChangeSubscriptions.forEach(value => value(this.start, this.end));
    }

    constructor(name: string, id: string, start: Date, end: Date, color?: string) {
        this.name = name;
        this.id = id;
        this.start = start
        this.end = end
        if (color) {
            if (TaskModelBase.stringIsColor(color)) {
                this.color = color;
            }
        }

    }

    abstract onUpdate(): void;

    getStart(): Date {
        return this.start;
    }

    setStart(newStart: Date) {
        this.start = newStart;
        this.onUpdate();
    }

    getEnd(): Date {
        return this.end;
    }

    setEnd(newEnd: Date) {
        this.end = newEnd;
        this.onUpdate();
    }

    getID(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }


    setStartEnd(newStart: Date, newEnd: Date): void {
        this.start = newStart;
        this.end = newEnd
        this.onUpdate();
    }

    getColor(): string | undefined {
        return this.color;
    }
}

export class MendixModelController {
    private static models: iMendixModel[] = [];

    public static add(newModel: iMendixModel): void {
        if (!this.models.find(v => v.getMxObj().getGuid() == newModel.getMxObj().getGuid())) {
            this.models.push(newModel)
        }
    }

    public static commit(): void {
        mx.data.commit({
            mxobjs: MendixModelController.models.map(v => v.getMxObj()),
            callback: () => {
            }
        })
    }
}

export interface iMendixModel {
    commit(): void;

    onUpdate(): void;

    getMxObj(): mendix.lib.MxObject;

    getID(): string;

}

export class MendixCustomWidgetTaskModel extends TaskModelBase implements iMendixModel {

    private mxObj: mendix.lib.MxObject
    private taskNodeStartAttribute: string
    private taskNodeEndAttribute: string

    public static factory(objs: mendix.lib.MxObject[], taskNodeNameAttribute: string, taskNodeStartAttribute: string, taskNodeEndAttribute: string, taskNodeColorAttribute?: string): MendixCustomWidgetTaskModel[] {
        return objs.map(value => {
            return new MendixCustomWidgetTaskModel(
                value, taskNodeNameAttribute, taskNodeStartAttribute, taskNodeEndAttribute, taskNodeColorAttribute
            )
        })
    }

    constructor(mxObj: mendix.lib.MxObject, taskNodeNameAttribute: string, taskNodeStartAttribute: string, taskNodeEndAttribute: string, taskNodeColorAttribute?: string) {
        super(mxObj.get(taskNodeNameAttribute) as string,
            mxObj.getGuid() as string,
            new Date((mxObj.get(taskNodeStartAttribute) as number)),
            new Date((mxObj.get(taskNodeEndAttribute) as number)), taskNodeColorAttribute ? (mxObj.get(taskNodeColorAttribute) as string) : undefined);
        this.mxObj = mxObj;
        MendixModelController.add(this)
        mx.data.subscribe({
            guid: mxObj.getGuid(),
            callback: () => {
                const possibleNewStart = new Date(mxObj.get(taskNodeStartAttribute) as number)
                const possibleNewEnd = new Date(mxObj.get(taskNodeEndAttribute) as number);
                if (possibleNewStart.valueOf() != this.start.valueOf() || possibleNewEnd.valueOf() != this.end.valueOf()) {
                    this.start = possibleNewStart
                    this.end = possibleNewEnd
                    this.callSubs();
                }
            }
        })
        this.taskNodeStartAttribute = taskNodeStartAttribute;
        this.taskNodeEndAttribute = taskNodeEndAttribute;
    }

    public getMxObj(): mendix.lib.MxObject {
        return this.mxObj;
    }

    commit(): void {
        mx.data.commit({
            mxobj: this.mxObj,
            callback: () => {
            }
        })
    }

    onUpdate(): void {
        this.mxObj.set(this.taskNodeStartAttribute, this.getStart().valueOf())
        this.mxObj.set(this.taskNodeEndAttribute, this.getEnd().valueOf())
        mx.data.update({guid: this.mxObj.getGuid()})
    }

}