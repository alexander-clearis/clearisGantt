import { ScaleType } from "./ScaleType";

export class ScaleMode {
  private _parent: ScaleType;
  private _parent_in_view: number;

  private _child: ScaleType | undefined;
  private _label: string;

  constructor(label: string, parent: ScaleType, parent_in_view: number, child?: ScaleType) {
    this._label = label;
    this._parent = parent;
    this._parent_in_view = parent_in_view;
    this._child = child;
  }

  public relativeScaleType(): ScaleType {
    return this._child ? this._child : this._parent;
  }
  get parent(): ScaleType {
    return this._parent;
  }

  get parent_in_view(): number {
    return this._parent_in_view;
  }

  get child(): ScaleType | undefined {
    return this._child;
  }

  get label(): string {
    return this._label;
  }
}

export class SingleScaleMode {

}