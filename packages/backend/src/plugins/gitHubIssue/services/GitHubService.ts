import { graphql } from '@octokit/graphql';
import {
  GitHubIssueDocument,
  Status,
} from '../search/DefaultGitHubIssuesCollator';
import { Repository, IssueConnection } from '@octokit/graphql-schema';

class GitHubService {
  private token: string;
  graphqlWithAuth: typeof graphql;

  constructor(token: string) {
    this.token = token;

    this.graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${this.token}`,
      },
    });
  }

  // Note: https://github.com/octokit/graphql.js/ does not offer built-in pagination yet, https://github.com/octokit/octokit.js does
  // Also, the Backstage.io catalog-backend has a custom helper function for this:
  // https://github.com/backstage/backstage/blob/618d78495cf6cdf8928365a20b97435c5a65074d/plugins/catalog-backend/src/ingestion/processors/github/github.ts#L337
  async getIssues(
    repositoryName: string,
    repositoryOwner: string,
    last = 100,
  ): Promise<GitHubIssueDocument[]> {
    let openIssues: GitHubIssueDocument[] = [];

    const query = `query lastIssues($name: String!, $owner: String!, $last: Int) { 
      repository(name: $name, owner: $owner) {
            issues(last: $last) {
              edges {
                node {
                  title
                  body
                  url
                  state
                  author {
                    login
                    avatarUrl
                    url
                  }
                }
              }
            }
          }
        }`;

    try {
      const {
        repository: { issues },
      } = await this.graphqlWithAuth<{
        repository: Repository;
        issues: IssueConnection;
      }>(query, {
        owner: repositoryOwner,
        name: repositoryName,
        last,
      });

      if (!issues.edges) return openIssues;

      openIssues = issues.edges.map(issueEdge => {
        const node = issueEdge?.node;

        return {
          author: {
            avatarUrl: node?.author?.avatarUrl,
            profileUrl: node?.author?.url,
            userId: node?.author?.login,
          },
          body: node?.body,
          title: node?.title,
          location: node?.url,
          status: node?.state === 'OPEN' ? Status.Open : Status.Closed,
        } as GitHubIssueDocument;
      });
    } catch (error) {
      console.error('Encountered an error when retrieving open issues', error);
    }

    return openIssues;
  }
}

export default GitHubService;
