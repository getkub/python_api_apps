- **Route 53**: Routes users to the closest healthy endpoint.
- **WAF**: Filters out malicious traffic.
- **CloudFront (Optional)**: Caches static content for faster delivery.
- **ALB**: Distributes traffic across the service mesh for rate limiting.
- **Service Mesh (Scalable Rate Limiting)**: Utilizes containerized rate limiting services for horizontal scaling. This includes multiple instances of the rate limiting container for increased capacity.
- **Kubernetes Cluster (Scalable)**: Manages containerized microservices running on worker nodes.
- **Microservices (as Containers)**: Your application broken down into independent, loosely coupled services.
- **API Gateway**: Manages API calls to your microservices.
- **DynamoDB (Scalable Database)**: Stores rate limiting counters and other application data.

```mermaid
graph TB
    Internet[Internet]
    Route53[Route 53]
    WAF[WAF]
    CloudFront[CloudFront]
    ALB[ALB]
    ServiceMesh[Service Mesh]
    subgraph RateLimitingGroup [Rate Limiting]
        RateLimiting1[Rate Limiting]
        RateLimiting2[Rate Limiting]
        RateLimiting3[Rate Limiting]
    end
    subgraph WorkerNodeGroup [Worker Node]
        WorkerNode1[Worker Node]
        WorkerNode2[Worker Node]
        WorkerNode3[Worker Node]
    end
    APIGateway[API Gateway]
    K8sCluster[Kubernetes Cluster]
    DynamoDB[DynamoDB]

    Internet --> Route53
    Route53 --> WAF
    WAF --> CloudFront
    CloudFront --> ALB
    ALB --> ServiceMesh
    ServiceMesh --> RateLimitingGroup
    RateLimiting1 --> WorkerNodeGroup
    RateLimiting2 --> WorkerNodeGroup
    RateLimiting3 --> WorkerNodeGroup
    WorkerNode1 -.->|Microservices as Containers|APIGateway
    WorkerNode2 -.->|Microservices as Containers|APIGateway
    WorkerNode3 -.->|Microservices as Containers|APIGateway
    APIGateway --> K8sCluster
    K8sCluster --> DynamoDB

    classDef optional fill:#f9f,stroke-width:4px;
    class CloudFront optional;

    classDef scalable fill:#9f9,stroke-width:4px;
    class ServiceMesh,K8sCluster,DynamoDB scalable;

    classDef containers fill:#ccf,stroke-width:4px;
    class RateLimiting1,RateLimiting2,RateLimiting3 containers;

```

```
                                  +---------------+
                                  |     Internet   |
                                  +---------------+
                                                   |
                                               +-----------+
                                               |  Route 53  |
                                               +-----------+
                                                   |
                                               +-----------+
                                               |    WAF     |
                                               +-----------+
                                                   |
                                               +-----------+
                                               |  CloudFront | (Optional)
                                               +-----------+
                                                   |
                                               +-----------+          +-----------+
                                               |  ALB     |          |  Service Mesh  (Scalable Rate Limiting) |
                                               +-----------+          +-----------+
                                                                                |
                                                                            +-----------+         +-----------+         +-----------+
                                                                            |  Rate Limiting  |         |  Rate Limiting  |         |  Rate Limiting  | (Containers)
                                                                            +-----------+         +-----------+         +-----------+
                                                                                |
                                                                            +-----------+
                                                                                |
                             +-----------+          +-----------+
                             | Worker Node |         | Worker Node |         | Worker Node |
                             +-----------+         +-----------+         +-----------+
                                                 |                     |                     |
                                          (Microservices as Containers)
                                                 |                     |                     |
                             +-----------+         +-----------+         +-----------+
                                                   |
                             +-----------+          +-----------+
                             |  API Gateway  |          |  Kubernetes Cluster  (Scalable) |
                             +-----------+          +-----------------+
                                                   |                      |
                                               +-----------+         +-----------+         +-----------+
                                               |  DynamoDB   | (Scalable Database)
                                               +-----------+

```