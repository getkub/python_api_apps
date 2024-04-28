### Tagging

- https://systemdesign.one/system-design-interview-cheatsheet/#tagging-service
- https://justpaste.it/b26kl

FR:
1. user should be able to create tag using tag name and description
2. user should be able to add tags on products
3. user should be able to search tags to add using autocomplete
4. user should be able to search products using tags

 

NFR:
1. highly scalable
2. low latency autocomplete
3. System should save tags efficiently i.e. to avoid duplicates and similar type of multiple tags.
4. eventual consistency . Tags created might not be immediately visible in autocomplete but will be visible eventually.(SLA - 1-2sec)

