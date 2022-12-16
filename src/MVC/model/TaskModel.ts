export interface iGanttNode {
    getName(): string;

    getID(): string;

    getStart(): Date;

    setStart(newStart: Date): void;

    getEnd(): Date;

    setEnd(newEnd: Date): void;

    setStartEnd(newStart: Date, newEnd: Date): void;

    onUpdate(): void;
}


export interface iTaskModel extends iGanttNode {
    getEnd(): Date;

    setEnd(newEnd: Date): void;
}

export abstract class TaskModelBase implements iTaskModel {
    protected name: string;
    protected id: string;
    protected start: Date;
    protected end: Date;

    constructor(name: string, id: string, start: Date, end: Date) {
        this.name = name;
        this.id = id;
        this.start = start
        this.end = end
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
}

export class MockTaskModel extends TaskModelBase {

    constructor(name: string, id: string, start: Date, end: Date) {
        end.setMinutes(-1);
        super(name, id, start, end);
    }

    onUpdate() {
        console.log("TaskUpdateCall: ", JSON.stringify({
            name: this.name,
            guid: this.id,
            start: this.start.toLocaleString(),
            end: this.end.toLocaleString()
        }))
    }
}
export class MendixCustomWidgetTaskModel extends TaskModelBase {
    private mxObj: mendix.lib.MxObject
    private taskNodeStartAttribute: string
    private taskNodeEndAttribute: string


    constructor(mxObj: mendix.lib.MxObject, taskNodeNameAttribute: string,taskNodeStartAttribute: string, taskNodeEndAttribute: string) {
        super(mxObj.get(taskNodeNameAttribute) as string,
            mxObj.getGuid() as string,
            new Date((mxObj.get(taskNodeStartAttribute) as number)),
            new Date((mxObj.get(taskNodeEndAttribute) as number)));
        this.mxObj = mxObj;
        this.taskNodeStartAttribute = taskNodeStartAttribute;
        this.taskNodeEndAttribute = taskNodeEndAttribute;
    }

    onUpdate(): void {
        this.mxObj.set(this.taskNodeStartAttribute, this.getStart().valueOf())
        this.mxObj.set(this.taskNodeEndAttribute, this.getEnd().valueOf())
        mx.data.commit({
            mxobj: this.mxObj,
            callback: ()=> {}
        })
    }
}