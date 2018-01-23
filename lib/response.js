
class Response {
    
    constructor(data = null, failure = false) {
        this.data = data;
        this.failure = failure;
    }
    
    isFailure() {
        return this.failure;
    }

}

module.exports = Response;
