# Wedding Planner Backend

wedding-plan-backend v1 endpoint

Access API by opening https://us-central1-wedding-planner-64948.cloudfunctions.net/v1

### Auth

| Endpoint  | HTTP | Description     | Body                            |
| --------- | ---- | --------------- | ------------------------------- |
| `/signup` | POST | Create New User | `username`,`email` , `password` |
| `/signin` | POST | Login           | `username` , `password`         |

### Users

| Endpoint     | HTTP   | Description           | Body           |
| ------------ | ------ | --------------------- | -------------- |
| `/users/`    | GET    | Get All User          |                |
| `/users/:id` | GET    | Get Detail User by ID |                |
| `/users/:id` | PUT    | Update User by ID     | `married_date` |
| `/users/:id` | DELETE | Delete User by ID     |                |

### Tasks

| Endpoint          | HTTP   | Description            | Body                         |
| ----------------- | ------ | ---------------------- | ---------------------------- |
| `/tasks/`         | POST   | Create New Tasks       | `name`, `content`, `user_id` |
| `/tasks/`         | GET    | Get All Tasks          |                              |
| `/tasks?user_id=` | GET    | Get User Tasks         |                              |
| `/tasks/:id`      | GET    | Get Detail Tasks by ID |                              |
| `/tasks/:id`      | PUT    | Update Tasks by ID     | `name`,`content`             |
| `/tasks/:id`      | DELETE | Delete Tasks by ID     |                              |
