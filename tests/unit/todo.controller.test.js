const todoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');

TodoModel.create = jest.fn();

let req, res, next
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = null
});

describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo;
    })
  it('should a create todo function', () => {
    expect(typeof todoController.createTodo).toBe('function');
    })
    it('should call TodoModel.create', () => {
        req.body = newTodo
    todoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
    })
    it('should return 201 response', () => {
        req.body = newTodo;
        todoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it('should return json body in response', () => {
        TodoModel.create.mockReturnValue(newTodo);
        todoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })
});
    