## Scalable Issue Tracking System

Design a highly scalable issue tracking system used by millions of users. Discuss scaling aspects like data storage, API design, and handling high load.


## Diagram

```mermaid
flowchart TB
    subgraph "Client"
        subgraph "User Interface"
            UI[UI]
        end
    end
    subgraph "API Gateway"
        AG[API Gateway]
    end
    subgraph "Load Balancer"
        LB[Load Balancer]
    end
    subgraph "Microservices"
        subgraph "User Service"
            US[User Service]
        end
        subgraph "Issue Service"
            IC[Issue Creation]
            IR[Issue Read]
            IU[Issue Update]
            ID[Issue Delete]
        end
        subgraph "Event Service"
            ES[Event Service]
        end
        subgraph "Search Service"
            SS[Search Service]
        end
    end
    subgraph "Data Storage"
        subgraph "NoSQL Database"
            ND[NoSQL Database]
        end
        subgraph "User Database"
            UD[User Database]
        end
        subgraph "Audit Log Database"
            ALD[Audit Log Database]
        end
    end
    subgraph "Content Delivery Network"
        CDN[CDN]
    end

    UI --> AG
    AG --> LB
    LB --> US
    LB --> IC
    LB --> IR
    LB --> IU
    LB --> ID
    LB --> ES
    LB --> SS
    US --> ND
    IC --> ND
    IR --> ND
    IU --> ND
    ID --> ND
    IR --> ALD
    IU --> ALD
    ID --> ALD
    ES --> ND
    SS --> ND
    UD --> ND
    CDN --> UI

```


## Components

**API Gateway**: (Scalable & Load-balanced) Single entry point for API requests. Uses an API Gateway with auto-scaling to handle high traffic volumes.

**Load Balancer**: Distributes traffic across backend services for high availability. Consider a multi-tier load balancer with regional deployments for global reach.

**User Service (Microservice)**: (Horizontally Scalable) Manages user accounts, authentication, and authorization. Can be scaled horizontally by adding more instances.

**Issue Service (Microservice)**: (Horizontally Scalable, Database Sharding) Stores and manages issue data. Uses a horizontally scalable NoSQL database with sharding for efficient data distribution.

**Event Service (Microservice)**: (Horizontally Scalable, Message Queue) Publishes and subscribes to events related to issues. Utilizes a message queue like Kafka for asynchronous event handling.

**Search Service (Microservice)**: (Vertically Scalable, Search Engine) Enables searching and filtering of issues. May be vertically scaled with powerful search engines.

**Database (NoSQL with Sharding)**: Stores issue data. We use a horizontally scalable NoSQL database like Cassandra with sharding to distribute data across multiple nodes and improve read/write performance.

**User Database (Relational)**: Stores user data. A relational database like MySQL or Postgres provides ACID transactions and efficient user data management.

**Content Delivery Network (CDN)**: Delivers static content (images, CSS) geographically for faster loading times.

