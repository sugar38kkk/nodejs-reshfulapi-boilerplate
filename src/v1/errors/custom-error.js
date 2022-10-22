class CustomError extends Error {
  constructor(message) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

class ErrEntityNotFound extends CustomError {
  constructor(entity) {
    super(`${String(entity).toLowerCase()} not found.`);

    this.status = 404;
    this.key = 'ErrEntityNotFound'
  }
}

class ErrBadRequest extends CustomError {
  constructor(message) {
    super(`${message || 'Bad request'}`);

    this.status = 400;
    this.key = 'ErrBadRequest'
  }
}

class ErrInvalidRequest extends CustomError {
  constructor(errors) {
    super(`invalid request`);

    this.status = 400;
    this.key = 'ErrInvalidRequest'
    this.errors = errors.map((error) => {
      return {
        message: error.msg,
        field: error.param,
      };
    });
  }
}

class ErrInternal extends CustomError {
  constructor() {
    super(`something went wrong in the server`);

    this.status = 500;
    this.key = 'ErrInternal'
  }
}
class ErrCannotListEntity extends CustomError {
  constructor(entity) {
    super(`Cannot list ${String(entity).toLowerCase()}`);

    this.status = 400;
    this.key = `ErrCannotList${entity}`
  }
}
class ErrCannotDeleteEntity extends CustomError {
  constructor(entity) {
    super(`Cannot delte ${String(entity).toLowerCase()}`);

    this.status = 400;
    this.key = `ErrCannotDelete${entity}`
  }
}
class ErrCannotUpdateEntity extends CustomError {
  constructor(entity) {
    super(`Cannot delte ${String(entity).toLowerCase()}`);

    this.status = 400;
    this.key = `ErrCannotUpdate${entity}`
  }
}

class ErrCannotGetEntity extends CustomError {
  constructor(entity) {
    super(`Cannot get ${String(entity).toLowerCase()}`);

    this.status = 400;
    this.key = `ErrCannotGet${entity}`
  }
}
class ErrCannotCreateEntity extends CustomError {
  constructor(entity) {
    super(`Cannot Create ${String(entity).toLowerCase()}`);

    this.status = 400;
    this.key = `ErrCannotCreate${entity}`
  }
}
class ErrEntityDeleted extends CustomError {
  constructor(entity) {
    super(`${String(entity).toLowerCase()} deleted`);

    this.status = 400;
    this.key = `Err${entity}Deleted`
  }
}
class ErrEntityExisted extends CustomError {
  constructor(entity) {
    super(`${String(entity).toLowerCase()} already exists`);

    this.status = 400;
    this.key = `Err${entity}AlreadyExists`
  }
}
class ErrNoPermission extends CustomError {
  constructor() {
    super(`You have no permission`);

    this.status = 400;
    this.key = `ErrNoPermission`
  }
}


module.exports = {
  ErrEntityNotFound,
  ErrInvalidRequest,
  ErrInternal,
  ErrCannotListEntity,
  ErrCannotDeleteEntity,
  ErrCannotUpdateEntity,
  ErrCannotGetEntity,
  ErrEntityDeleted,
  ErrEntityExisted,
  ErrCannotCreateEntity,
  ErrNoPermission,
  ErrBadRequest
};
