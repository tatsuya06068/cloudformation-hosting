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


name: Deploy to S3

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'us-west-2'
          S3_BUCKET: 'my-app-green'  # デプロイ先のバケット
        run: |
          aws s3 sync ./build s3://$S3_BUCKET --delete
