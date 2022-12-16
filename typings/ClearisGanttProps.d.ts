
import { CSSProperties } from "react";
import { DynamicValue, ListValue, ListAttributeValue } from "mendix";

export interface CommonWidgetProps {
    id: string;
    class: string;
    style?: CSSProperties;
    friendlyId?: string;
    tabIndex: number;
    mxform: mxui.lib.form._FormBase;
    mxObject?: mendix.lib.MxObject;
}
export interface ClearisGanttContainerProps extends CommonWidgetProps{

}
