import {CSSProperties} from "react";
import {DynamicValue, ListValue, ListAttributeValue} from "mendix";

export interface CommonProps {
    id: string;
    class: string;
    style?: CSSProperties;
    friendlyId?: string;
    tabIndex: number;
    mxform: mxui.lib.form._FormBase;
    mxObject?: mendix.lib.MxObject;
}

export interface ClearisGanttContainerProps extends CommonProps {
    projectEntity: any;
    titleAttribute: string
    taskNodeEntity: string
    taskNodeNameAttribute: string
    taskNodeColorAttribute?: string
    taskNodeStartAttribute: string
    taskNodeEndAttribute: string
    microflow_projectActivities: any
    microflow_getChildren: any
    onClickAction: any

}
