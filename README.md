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

| Endpoint          | HTTP   | Description            | Body                          |
| ----------------- | ------ | ---------------------- | ----------------------------- |
| `/tasks/`         | POST   | Create New Tasks       | `title`, `content`, `user_id` |
| `/tasks/`         | GET    | Get All Tasks          |                               |
| `/tasks?user_id=` | GET    | Get User Tasks         |                               |
| `/tasks/:id`      | GET    | Get Detail Tasks by ID |                               |
| `/tasks/:id`      | PUT    | Update Tasks by ID     | `title`,`content`             |
| `/tasks/:id`      | DELETE | Delete Tasks by ID     |                               |

### Todo

| Endpoint                | HTTP   | Description                | Body               |
| ----------------------- | ------ | -------------------------- | ------------------ |
| `/todo/:task_id`        | POST   | Create New Todo by Task Id | `title`, `content` |
| `/todo/`                | GET    | Get All Todo               |                    |
| `/todo?task_id=`        | GET    | Get User Todo by Task ID   |                    |
| `/todo/:id`             | GET    | Get Detail Todo by ID      |                    |
| `/todo/:id`             | PUT    | Update Todo by ID          | `title`,`content`  |
| `/todo/:id/checklist`   | PUT    | To Complete a Todo         |                    |
| `/todo/:id/unchecklist` | PUT    | To Uncomplete a Todo       |                    |
| `/todo/:id`             | DELETE | Delete Todo by ID          |                    |

### Categories

| Endpoint               | HTTP   | Description                 | Body                          |
| ---------------------- | ------ | --------------------------- | ----------------------------- |
| `/categories/`         | POST   | Create New Categories       | `title`, `content`, `user_id` |
| `/categories/`         | GET    | Get All Categories          |                               |
| `/categories?user_id=` | GET    | Get User Categories         |                               |
| `/categories/:id`      | GET    | Get Detail Categories by ID |                               |
| `/categories/:id`      | PUT    | Update Categories by ID     | `title`,`content`             |
| `/categories/:id`      | DELETE | Delete Categories by ID     |                               |

### Check

| Endpoint                 | HTTP   | Description                     | Body               |
| ------------------------ | ------ | ------------------------------- | ------------------ |
| `/check/:category_id`    | POST   | Create New Check by Category Id | `title`, `content` |
| `/check/`                | GET    | Get All Check                   |                    |
| `/check?category_id=`    | GET    | Get User Check by Category ID   |                    |
| `/check/:id`             | GET    | Get Detail Check by ID          |                    |
| `/check/:id`             | PUT    | Update Check by ID              | `title`,`content`  |
| `/check/:id/checklist`   | PUT    | To Complete a Check             |                    |
| `/check/:id/unchecklist` | PUT    | To Uncomplete a Check           |                    |
| `/check/:id`             | DELETE | Delete Check by ID              |                    |
