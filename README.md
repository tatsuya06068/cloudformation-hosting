## package
https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-cli-package.html
```
aws cloudformation package \
  --template template.yml \
  --s3-bucket mybucketwebcloud/ \
  --output-template-file packaged-template.yml 

```

## deploy
https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-cli-deploy.html

```
aws cloudformation deploy \
  --template packaged-template.yml \
  --stack-name my-new-stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides "file://parameters/development.json"

```