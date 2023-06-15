const request = require('supertest');
const app = require('../server');
const { default: mongoose } = require('mongoose');
const server = require('../server');

describe('API Tests', () => {
  let authToken;
  let taskId;

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();

    // Save the JWT token for subsequent requests
    authToken = response.body.token;
  }, 20000);

  it('should login a user', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();

    // Save the JWT token for subsequent requests
    authToken = response.body.token;
  }, 20000);

  it('should create a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Task 1',
        description: 'Description for Task 1',
        dueDate: '2023-06-30',
        priority: 'Medium',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Task 1');
    expect(response.body.description).toBe('Description for Task 1');

    // Save the task ID for subsequent requests
    taskId = response.body._id;
  }, 20000);

  it('should update an existing task', async () => {
    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Task',
        description: 'Updated description',
        dueDate: '2023-07-15',
        priority: 'High',
        status: 'In Progress',
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Task');
    expect(response.body.description).toBe('Updated description');
    expect(response.body.dueDate).toBe('2023-07-15');
    expect(response.body.priority).toBe('High');
    expect(response.body.status).toBe('In Progress');
  });

}, 20000);

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
