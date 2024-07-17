const { WAFV2Client, UpdateWebACLCommand } = require("@aws-sdk/client-wafv2");

exports.handler = async (event) => {
    const client = new WAFV2Client({ region: "us-east-1" });

    const params = {
        Name: "my-web-acl", // Web ACLの名前
        Scope: "REGIONAL", // グローバルWAFの場合は 'CLOUDFRONT'
        Id: "your-web-acl-id", // Web ACLのID
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

    try {
        const command = new UpdateWebACLCommand(params);
        const response = await client.send(command);
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
