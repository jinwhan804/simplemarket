const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const Swagger = require("../handler/swagger");
const user = require("../docs/api/user/index");
const posts = require("../docs/api/posts/index");
const reply = require("../docs/api/reply/index");
const rereply = require("../docs/api/rereply/index");

class ApiDocs {
  #apiDocOption;
  #swagger;

  constructor() {
    this.#apiDocOption = {
      ...user,
      ...posts,
      ...reply,
      ...rereply
    };

    this.#swagger = new Swagger();
  }

  init() {
    this.#swagger.addAPI(this.#apiDocOption);
  }

  getSwaggerOption() {
    const { apiOption, setUpoption } = this.#swagger.getOption();

    const specs = swaggerJsDoc(apiOption);

    return {
      swaggerUI,
      specs,
      setUpoption,
    };
  }
}

module.exports = ApiDocs;
