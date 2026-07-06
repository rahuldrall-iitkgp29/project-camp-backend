class ApiRespones {
  constructor(statuscode, data, message = "SUCCESS") {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode < 400; // above this usely is error
  }
}

export { ApiRespones };
