import { WAFV2Client, GetWebACLCommand, UpdateWebACLCommand } from "@aws-sdk/client-wafv2";

export const handler = async (event) => {
    const client = new WAFV2Client({ region: "us-east-1" });

    const webAclParams = {
        Name: "my-web-acl", // Web ACLの名前
        Scope: "CLOUDFRONT", // グローバルWAFの場合は 'CLOUDFRONT'
        Id: "your-web-acl-id" // Web ACLのID
    };

    try {
        // 現在のWeb ACLの状態を取得
        const getWebAclCommand = new GetWebACLCommand(webAclParams);
        const webAclData = await client.send(getWebAclCommand);

        const params = {
            Name: "my-web-acl", // Web ACLの名前
            Scope: "CLOUDFRONT", // グローバルWAFの場合は 'CLOUDFRONT'
            Id: "your-web-acl-id", // Web ACLのID
            LockToken: webAclData.LockToken, // 必要なLockTokenを追加
            DefaultAction: { Block: {} }, // BlockまたはAllowに変更
            Rules: [
                {
                    Name: "MyRule",
                    Priority: 1,
                    Statement: {
                        ManagedRuleGroupStatement: {
                            VendorName: "AWS",
                            Name: "AWSManagedRulesCommonRuleSet"
                        }
                    },
                    Action: {
                        Block: {} // または 'Allow': {}
                    },
                    VisibilityConfig: {
                        SampledRequestsEnabled: true,
                        CloudWatchMetricsEnabled: true,
                        MetricName: "MyRule"
                    }
                }
            ],
            VisibilityConfig: {
                SampledRequestsEnabled: true,
                CloudWatchMetricsEnabled: true,
                MetricName: "my-web-acl"
            }
        };

        // Web ACLの更新
        const updateWebAclCommand = new UpdateWebACLCommand(params);
        const response = await client.send(updateWebAclCommand);
        console.log("WAF rule updated successfully", response);
        return {
            statusCode: 200,
            body: JSON.stringify('WAF rule updated successfully'),
        };
    } catch (error) {
        console.error("Error updating WAF rule", error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error updating WAF rule'),
        };
    }
};
