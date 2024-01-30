# CDK TypeScript project

## Resources

1. API Gateway
2. Lambda

### Prepare AWS environment
```sh
  npx cdk bootstrap
```

### Deploy your stacks
```sh
  npx cdk deploy
```

## Useful commands

* `npm run build`     compile typescript to js
* `npm run watch`     watch for changes and compile
* `npm run test`      perform the jest unit tests
* `npx cdk list`      list available stacks
* `npx cdk bootstrap` prepare an AWS environment to deploy your CDK applications
* `npx cdk deploy`    deploy this stack to your default AWS account/region
* `npx cdk diff`      compare deployed stack with current state
* `npx cdk synth`     emits the synthesized CloudFormation template
