export interface iTask {
  get name(): string;
  get start(): Date;
  get end(): Date;
  get children(): iTask[];

}


export class mockTask implements iTask{
  private _name: string;
  private _start: Date;
  private _end: Date;
  private _children: iTask[] = [];


  constructor(name: string, start: Date, end: Date, children?: iTask[]) {
    this._name = name;
    this._start = start;
    this._end = end;
    if(children) this._children.concat(children)
  }


  get name(): string {
    return this._name;
  }

  get start(): Date {
    return this._start;
  }

  get end(): Date {
    return this._end;
  }

  get children(): iTask[] {
    return this._children;
  }
}
