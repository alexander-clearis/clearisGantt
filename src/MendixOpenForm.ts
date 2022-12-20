export class MendixOpenForm  {
    form: any


    constructor(form: any) {
        this.form = form;
    }

    getContext(mxObj: mendix.lib.MxObject): mendix.lib.MxContext {
        const context = new window.mendix.lib.MxContext();

        if (mxObj && mxObj.getGuid()) {
            const entity = mxObj.getEntity();
            context.setContext(entity, mxObj.getGuid());
            // @ts-ignore
        }

        return context;
    }

    public open(mxObj: mendix.lib.MxObject): void {
        mx.ui.openForm(this.form, {
            location: "content",
            callback: (_form) => {
              // form.close();
            },
            context: this.getContext(mxObj)

        });


    }
}