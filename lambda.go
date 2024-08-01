package main

import (
    "context"
    "fmt"
    "github.com/aws/aws-lambda-go/lambda"
    "github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/aws/session"
    "github.com/aws/aws-sdk-go/service/ec2"
)

type Request struct {
    Action       string `json:"action"`       // "start" or "stop"
    NatGatewayID string `json:"natGatewayId"` // NAT Gateway ID (required for "stop")
    SubnetID     string `json:"subnetId"`     // Subnet ID (required for "start")
    EipAllocationID string `json:"eipAllocationId"` // EIP Allocation ID (required for "start")
}

func handleRequest(ctx context.Context, req Request) (string, error) {
    sess := session.Must(session.NewSession())
    svc := ec2.New(sess)

    switch req.Action {
    case "stop":
        if req.NatGatewayID == "" {
            return "", fmt.Errorf("natGatewayId is required for stop action")
        }
        return stopNatGateway(svc, req.NatGatewayID)
    case "start":
        if req.SubnetID == "" || req.EipAllocationID == "" {
            return "", fmt.Errorf("subnetId and eipAllocationId are required for start action")
        }
        return startNatGateway(svc, req.SubnetID, req.EipAllocationID)
    default:
        return "", fmt.Errorf("unknown action: %s", req.Action)
    }
}

func stopNatGateway(svc *ec2.EC2, natGatewayID string) (string, error) {
    input := &ec2.DeleteNatGatewayInput{
        NatGatewayId: aws.String(natGatewayID),
    }

    result, err := svc.DeleteNatGateway(input)
    if err != nil {
        return "", fmt.Errorf("failed to delete NAT Gateway: %w", err)
    }

    return fmt.Sprintf("Deleted NAT Gateway: %s", *result.NatGatewayId), nil
}

func startNatGateway(svc *ec2.EC2, subnetID, eipAllocationID string) (string, error) {
    input := &ec2.CreateNatGatewayInput{
        SubnetId: aws.String(subnetID),
        AllocationId: aws.String(eipAllocationID),
    }

    result, err := svc.CreateNatGateway(input)
    if err != nil {
        return "", fmt.Errorf("failed to create NAT Gateway: %w", err)
    }

    return fmt.Sprintf("Created NAT Gateway: %s", *result.NatGateway.NatGatewayId), nil
}

func main() {
    lambda.Start(handleRequest)
}
