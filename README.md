# Wedding Planner Backend

wedding-plan-backend v1 endpoint

Access API by opening https://us-central1-wedding-planner-64948.cloudfunctions.net/v1

### Auth

| Endpoint  | HTTP | Description     | Body                            |
| --------- | ---- | --------------- | ------------------------------- |
| `/signup` | POST | Create New User | `username`,`email` , `password` |
| `/signin` | POST | Login           | `username` , `password`         |
