const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";

let firstTodo, newTodoId, createdForDelete;
const testData = {
  title: "Make integration test for PUT",
  done: true,
};
const notExistingTodoId = "641f3c3d0ac28f9d6458a3c3";
const delTodoId = "680f4b8809abd38fcfd60fb5";

describe(endpointUrl, () => {
  it("POST " + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });
  it(
    "should return error 500 on malformed data with post" + endpointUrl,
    async () => {
      const response = await request(app)
        .post(endpointUrl)
        .send({ title: "Missing done property" });
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: "Todo validation failed: done: Path `done` is required.",
      });
    }
  );
  test("GET " + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });

  test("GET by Id " + endpointUrl + "todoId:", async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  test("GET todoby id doesn't exist " + endpointUrl + "todoId:", async () => {
    const response = await request(app).get(endpointUrl + notExistingTodoId);
    expect(response.statusCode).toBe(404);
  });

  it("PUT " + endpointUrl, async () => {
    const res = await request(app)
      .put(endpointUrl + newTodoId)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.done).toBe(testData.done);
  });

  it("should return 404 on PUT" + endpointUrl, async () => {
    const res = await request(app)
      .put(endpointUrl + notExistingTodoId)
      .send(testData);
    expect(res.statusCode).toBe(404);
  });

  it("DELETE " + endpointUrl + delTodoId, async () => {
    const createRes = await request(app).post(endpointUrl).send({
      title: "Todo to be deleted",
      done: false,
    });
    createdForDelete = createRes.body._id;

    const res = await request(app)
      .delete(endpointUrl + createdForDelete)
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Todo deleted successfully");
  });

  it("should return 404 on DELETE" + endpointUrl + notExistingTodoId, async () => {
    const res = await request(app)
      .delete(endpointUrl + notExistingTodoId)
    expect(res.statusCode).toBe(404);
  });
});