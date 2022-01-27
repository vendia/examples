# Domain Driven Design

A software developer named Eric Evans recognized the need to understand the software domain. To introduce the DDD approach, he wrote a book called Domain-Driven Design: Tackling Complexity in the Heart of Software. In his book, Evans says, “The heart of the software is its ability to solve domain-related problems for its user. All other features, vital though they may be, support this basic purpose.”

The most obvious advantage of DDD is that it gets everybody using the same language. When development teams use the same language as domain experts, it leads to software design that makes sense to the end user. Because the terminology in the application corresponds to real-world activities, there is less confusion and users will understand how to use the product more quickly.

Check out four DDD patterns that we apply to Vendia Share Universal Applications ( or `Unis` for short).

## Pattern 1: Single Domain, Single Bounded Context, and a Single Uni

[Pattern 1](domain-driven-design/README.md) is well suited for organizations who want to build small custom applications surrounding complex enterprise applications, or organizations who want to construct a new application to prove a new business idea.

## Pattern 2: Single Domain, Multiple Bounded Contexts, and a Single Uni
[Pattern 2](domain-driven-design/README.md) is well suited for organizations who already have experience working with Uni and want to leverage existing Uni implementation in their organization with more custom and new applications. This model is also a good fit for new analytics focussed domains within the organization that has not built its software platform yet. These organizations can continue to operate lean by leveraging Uni owned by other domains with read-only copies of data for analytics and visualization.

## Pattern 3: Two Domains, Multiple Bounded Contexts, and a Single Uni
[Pattern 3](domain-driven-design/README.md) is applicable for organizations where an existing domain has its own software systems but wants to leverage the Uni owned and operated by other domains for both read and write access on a small part of the domain data model. The intent is to scale as much as on the existing Uni owned by the other domains before spinning a dedicated Uni for the domain.

## Pattern 4: Multiple Domain, Multiple Bounded Contexts, and Multiple Unis
[Pattern 4](domain-driven-design/README.md) is applicable to large enterprise customers with strong governance and control requirements for software owned and operated by each domain. You will also consider this pattern if the domain data model is complex, requires higher assurance and guarantee on throughput, or sensitivity of your domain justifies Uni level isolation.
