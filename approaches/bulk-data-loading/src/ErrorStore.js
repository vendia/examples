export class ErrorStore {

    constructor() {
        this.errorMap = {};
    }

    logErrors() {
        if(Object.keys(this.errorMap).length > 0) {
            console.log("Error map", this.errorMap);
        } else {
            console.log("No errors :)");
        }
    }

    addError(status) {
        if(this.errorMap[status] == null) {
            this.errorMap[status] = 0;
        }
        this.errorMap[status] = this.errorMap[status] + 1;
    }
}
