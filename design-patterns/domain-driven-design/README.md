# Domain Driven Design

A software developer named Eric Evans recognized the need to understand the software domain. To introduce the DDD approach, he wrote a book called Domain-Driven Design: Tackling Complexity in the Heart of Software. In his book, Evans says, “The heart of the software is its ability to solve domain-related problems for its user. All other features, vital though they may be, support this basic purpose.”

The most obvious advantage of DDD is that it gets everybody using the same language. When development teams use the same language as domain experts, it leads to software design that makes sense to the end user. Because the terminology in the application corresponds to real-world activities, there is less confusion and users will understand how to use the product more quickly.

Check out four DDD patterns that we apply to Vendia Share Universal Applications ( or `Unis` for short).

## Pattern 1: Single Domain, Single Bounded Context, and a Single Uni

[Pattern 1](pattern1/README.md) is well suited for organizations that want to build small custom applications surrounding complex enterprise applications, or organizations that want to construct a new application to prove a new business idea.

## Pattern 2: Single Domain, Multiple Bounded Contexts, and a Single Uni
[Pattern 2](pattern2/README.md) is well suited for organizations that already have experience working with Unis and want to leverage an existing Uni implementation in their organization with more custom and new applications. This model is also a good fit for new analytics focused domains within the organization that have not built their software platform yet. These organizations can continue to operate lean by leveraging Unis owned by other domains with read-only copies of data for analytics and visualization.

## Pattern 3: Two Domains, Multiple Bounded Contexts, and a Single Uni
[Pattern 3](pattern3/README.md) is applicable for organizations that have software systems in an existing domain but want to leverage Unis owned and operated by other domains for access to a small part of the domain data model. The intent is to scale as much as on existing Unis owned by other domains before deploying a dedicated Uni for the domain.

## Pattern 4: Multiple Domain, Multiple Bounded Contexts, and Multiple Unis
[Pattern 4](pattern4/README.md) is applicable to large enterprise customers with strong governance and control requirements for software owned and operated by each domain. You will also consider this pattern if the domain data model is complex, requires higher assurance and guarantee on throughput, or sensitivity of your domain justifies Uni level isolation.
