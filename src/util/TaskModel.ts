export interface iTask {
    getID(): string;

    getName(): string;

    getStart(): Date;

    getEnd(): Date;

    getColour(): string | undefined;

    getChildren(): iTask[] | undefined;

    addChildren(...children: iTask[]): void;

    setParent(parent: iTask): void;
    getParent(): iTask | undefined;
    removeParent(): void;
    // something for the view!!
    // display(value: boolean): void;
    //
    // getDisplay(): boolean;
    //
    // getDisplayChildren(): boolean;
    //
    // displayChildren(value: boolean): void;
    //
    // toggleDisplayChildren(): boolean;
}

export abstract class baseTask implements iTask {
    protected _id: string;
    protected _name: string;
    protected _start: Date;
    protected _end: Date;
    protected _parent?: iTask;
    protected _children?: iTask[];


    constructor(id: string, name: string, start: Date, end: Date, parent?: iTask, children?: iTask[]) {
        this._id = id;
        this._name = name;
        this._start = start;
        this._end = end;
        this._parent = parent;
        this._children = children;

        console.log(this)
    }


    public getID(): string {
        return this._id;
    }

    public getName(): string {
        return this._name;
    }


    public getStart(): Date {
        return this._start;
    }

    public getEnd(): Date {
        return this._end;
    }

    public getChildren(): iTask[] | undefined {
        return this._children;
    }

    public getColour(): string {
        return "";
    }

    public addChildren(...children: iTask[]): void {
        for (let i = 0; i < children.length; i++) {
            if (!this._children) {
                this._children = [];
            }
            if (!this._children.find(value => value.getID() === children[i].getID())) {
                this._children.push(children[i]);
            }
        }
    }

    getParent(): iTask | undefined {
        return this._parent;
    }

    removeParent(): void {
        this._parent = undefined;
    }

    setParent(parent: iTask): void {
        this._parent = parent;
    }
}

export class mockTask extends baseTask implements iTask {

}
