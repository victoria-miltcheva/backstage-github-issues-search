# backstage-github-issues-search

This [Backstage](https://backstage.io) app contains a GitHub issues [search collator](https://backstage.io/docs/features/search/concepts#collators) for retrieving [issues](https://github.com/backstage/backstage/issues) from the Backstage [repository](https://github.com/backstage/backstage).

Only 100 issues will be retrieved since it this is max allowed per page for [@octokit/graphql](https://www.npmjs.com/package/@octokit/graphql); this package does not yet support pagination looping.

## Local Dev

To run this project, you will need to provide own GitHub OAuth token. Follow [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to generate one. Afterwards, open [`app-config.local.yaml`](./app-config.local.yaml) and replace the value of `integrations.github.token` with it.

To start the app, run:

```sh
yarn install
yarn dev
```
