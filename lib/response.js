class Response {

    constructor(failure = false) {
        if (failure) {
            this.setFailure(failure);
        }
    }

    setFailure(message) {
        if (message.length) {
            if (this.failure) {
                this.setAdditionalFailure(message);
            } else {
                this.failure = message;
            }
        } else {
            this.failure = false;
        }
    }

    isFailure() {
        return this.failure;
    }

    setAdditionalFailure(message) {
        if (Array.isArray(this.additionalFailures)) {
            this.additionalFailures.push(message);
        } else {
            this.additionalFailures = [message];
        }
    }

    triggerError() {
        if (this.failure) {
            throw new Error(this.failure);
        }
    }

}

module.exports = Response;
