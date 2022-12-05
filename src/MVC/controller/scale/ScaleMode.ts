import { ScaleType } from "./ScaleType";
import {v4 as uuid} from 'uuid';

export class ScaleMode {
  private readonly _parent: ScaleType;
  private readonly _parent_in_view: number;

  private readonly _child: ScaleType | undefined;
  private readonly _label: string;
  private readonly _id: string = uuid();


  constructor(label: string, parent: ScaleType, parent_in_view: number, child?: ScaleType) {
    this._label = label;
    this._parent = parent;
    this._parent_in_view = parent_in_view;
    this._child = child;
  }

  public relativeScaleType(): ScaleType {
    return this._child ? this._child : this._parent;
  }
  parent(): ScaleType {
    return this._parent;
  }

  parent_in_view(): number {
    return this._parent_in_view;
  }

  child(): ScaleType | undefined {
    return this._child;
  }

  label(): string {
    return this._label;
  }
  getId(): string {
    return this._id
  }

}
