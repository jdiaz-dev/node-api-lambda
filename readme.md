## Deploy todo list lambda
```bash
$ npm run deploy

```

## Call lambda locally
```
$ serverless invoke local --function todo --path local-test/createTodo.json
$ serverless invoke local --function todo --path local-test/deleteTodo.json
$ serverless invoke local --function todo --path local-test/getTodo.json
$ serverless invoke local --function todo --path local-test/getTodos.json
$ serverless invoke local --function todo --path local-test/updateTodo.json
```
## Runn swagger

```bash
$ serverless offline start

```

To open swagger in local

```
    http://localhost:3000/swagger
```