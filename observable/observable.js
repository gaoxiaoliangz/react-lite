// simple implemention of rxjs observable

class Observable {
  constructor(connector) {
    this.connector = connector
    this.observer = {
      onNext: (val) => {
        if (this.handler) {
          this.handler(val)
        }
      },
      onCompleted: (val) => {
        if (this.handler) {
          this.handler(val)
        }
        if (this.doneHandler) {
          this.doneHandler(val)
        }
      },
      onError: (err) => {
        if (this.errorHandler) {
          this.errorHandler(err)
        }
      }
    }
    this.connector(this.observer)
  }

  subscribe(handler) {
    this.handler = handler
    return this
  }

  done(doneHandler) {
    this.doneHandler = doneHandler
    return this
  }

  catch(errorHandler) {
    this.errorHandler = errorHandler
    return this
  }
}

export default Observable
