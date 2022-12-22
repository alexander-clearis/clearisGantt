
export type actionResult =  string | number | boolean | mendix.lib.MxObject | mendix.lib.MxObject[];
export class MendixMicroflow {
    private name: string
    private mxform: mxui.lib.form._FormBase;
    private contextObj?: mendix.lib.MxObject;


    constructor(name: string, mxform: mxui.lib.form._FormBase, contextObj?: mendix.lib.MxObject) {
        this.name = name;
        this.mxform = mxform;
        this.contextObj = contextObj;
    }

    getContext(): mendix.lib.MxContext {
        const context = new window.mendix.lib.MxContext();

        if (this.contextObj && this.contextObj.getGuid) {
            const entity = this.contextObj.getEntity();
            context.setContext(entity, this.contextObj.getGuid());
            // @ts-ignore
        }

        return context;
    }

    executeToConsole(): void {
        const callBack = (_obj: any) => {
            }
        mx.data.action({
            params: {
                actionname: this.name,
            },
            origin: this.mxform,
            context: this.getContext(),
            callback: function (obj) {
                callBack(obj)
            },
            error: function(error) {
                alert(error.message);
            },
        });
    }


    async execute(): Promise<string | number | boolean | mendix.lib.MxObject | mendix.lib.MxObject[]> {
        return new Promise((resolve, reject) => {
            mx.data.action({
                params: {
                    actionname: this.name
                },
                origin: this.mxform,
                context: this.getContext(),
                callback: (result) => {
                    resolve(result);
                },
                error: (error) => {
                    reject(error)
                },
            });

        })
    }

}