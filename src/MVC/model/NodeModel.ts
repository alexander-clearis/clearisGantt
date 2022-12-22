import {MendixGanttFactory} from "./GanttModelFactory";

export interface iNodeModel {
    getName(): string;

    getID(): string;

    getParentID(): string | undefined;

    getStart(): Date;

    setStart(newStart: Date): void;

    getEnd(): Date;

    setEnd(newEnd: Date): void;

    getColor(): string | undefined

    setStartEnd(newStart: Date, newEnd: Date): void;

    onUpdate(): void;

    addSubscribeOnChange(onChange: (newStart: Date, newEnd: Date) => void): void
}

export abstract class NodeModel implements iNodeModel {
    protected name: string;
    protected id: string;
    protected start: Date;
    protected end: Date;
    protected parent?: string;
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

    constructor(name: string, id: string, start: Date, end: Date, parentID?: string, color?: string) {
        this.name = name;
        this.id = id;
        this.start = start
        this.end = end
        if (parentID != "") {
            this.parent = parentID;
        }
        if (color) {
            if (NodeModel.stringIsColor(color)) {
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

    getParentID(): string | undefined {
        return this.parent;
    }
}


export interface iMxNodeModel extends NodeModel {
    commit(): void;

    onUpdate(): void;

    getMxObj(): mendix.lib.MxObject;

    getID(): string;
}


export abstract class MxNodeModel extends NodeModel implements iMxNodeModel {
    private mxObj: mendix.lib.MxObject
    public factory: MendixGanttFactory

    constructor(mxObj: mendix.lib.MxObject, factory: MendixGanttFactory, name: string, id: string, start: Date, end: Date, parentID?: string, color?: string) {
        super(name, id, start, end, parentID, color);
        this.mxObj = mxObj;
        this.factory = factory

                mx.data.subscribe({
            guid: mxObj.getGuid(),
            callback: () => {
                const possibleNewStart = new Date(mxObj.get(this.factory.getNodeStartAttribute()) as number)
                const possibleNewEnd = new Date(mxObj.get(this.factory.getNodeEndAttribute()) as number);
                if (possibleNewStart.valueOf() != this.start.valueOf() || possibleNewEnd.valueOf() != this.end.valueOf()) {
                    this.start = possibleNewStart
                    this.end = possibleNewEnd
                    this.callSubs();
                }
            }
        })

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
        this.mxObj.set(this.factory.getNodeStartAttribute(), this.getStart().valueOf())
        this.mxObj.set(this.factory.getNodeEndAttribute(), this.getEnd().valueOf())
        mx.data.update({guid: this.mxObj.getGuid()})
    }
}