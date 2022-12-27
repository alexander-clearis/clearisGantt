import {Component, createElement, ReactNode} from "react";
import {ClearisGanttContainerProps} from "../typings/ClearisGanttProps";
import "./ui/ClearisGantt.css";
import {ClearisGanttController, iGanttController} from "./MVC/controller/ClearisGanttController";
import {ClearsGanttContainer} from "./MVC/view/ClearisGanttContainer";
import {MendixMicroflow} from "./MendixMicroflow";

import {MendixOpenForm} from "./MendixOpenForm";
import {iNodeController} from "./MVC/controller/NodeController";
import {MendixGanttFactory} from "./MVC/model/GanttModelFactory";

// import {TaskController} from "./MVC/controller/TaskController";
// import {iTaskModel, MockTaskModel} from "./MVC/model/TaskModel";
// import {v4 as uuid} from "uuid";
// import {iNodeController} from "./MVC/controller/NodeController";


export interface ClearisGanttState {
    MxContextObj?: mendix.lib.MxObject;
}

class ClearisGantt extends Component<ClearisGanttContainerProps, ClearisGanttState> {

    private readonly service: iGanttController;
    private factory?: MendixGanttFactory;

    constructor(props: ClearisGanttContainerProps, context: any) {
        super(props, context);
        this.state = {
            MxContextObj: this.props.mxObject

        }

        this.service = new ClearisGanttController(this.getChartTitle(), 1500, 640, []);
    }

    async setRoot(): Promise<iNodeController[]> {

        return new MendixMicroflow(this.props.microflow_projectActivities as string, this.props.mxform, this.props.mxObject).execute().then(
            microflowResult => {
                return this.factory!.factorTaskModels(microflowResult as mendix.lib.MxObject[]).factorRootNodes();
            }
        );
    }


    componentDidUpdate() {
            if (this.state.MxContextObj === undefined && this.props.mxObject != undefined) {

                this.setState({MxContextObj: this.props.mxObject});

                this.updateChartTitle();

                this.factory = new MendixGanttFactory(
                    (mxobj: mendix.lib.MxObject) => {
                        new MendixOpenForm(this.props.onClickAction).open(mxobj);
                    },
                    this.props.taskNodeNameAttribute,
                    this.props.taskNodeStartAttribute,
                    this.props.taskNodeEndAttribute,
                    this.props.taskNodeParentAssoc,
                    this.props.taskNodeColorAttribute
                );

                this.setRoot().then(collectedNodes => {
                        this.service.addNodes(collectedNodes)

                    }
                )

                this.service.setCancel(() => {
                    //todo: implement rollback!
                    this.props.mxform.rollback(() => {
                    })
                    this.props.mxform.close();
                })
                this.service.setSave(() => {
                    this.factory?.commit();
                    this.props.mxform.close();
                })

            }


    }

    getChartTitle(): string {
        return this.state.MxContextObj?.get(this.props.titleAttribute) as string ?? "Title not found"
    }

    updateChartTitle() {
        this.service.setTitle(this.getChartTitle());
    }

    render(): ReactNode {
        this.updateChartTitle();
        return <ClearsGanttContainer GanttController={this.service}/>
    }
}

export default ClearisGantt
