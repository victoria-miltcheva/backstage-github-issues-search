/* eslint-disable no-console */
import { Config } from '@backstage/config';
import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import GitHubService from '../services/GitHubService';
import {
  gitHubRepositoryName,
  gitHubRepositoryOwner,
} from '../constants/gitHubRepository';
import { GitHubIntegrationConfig } from '../constants/config';

interface GitHubUser {
  userId: string;
  avatarUrl: string;
  profileUrl: string;
}

export enum Status {
  Open = 'Open',
  Closed = 'Closed',
}

export interface GitHubIssueDocument extends IndexableDocument {
  title: string;
  body: string;
  author: GitHubUser;
  location: string;
  status: Status;
}

export class DefaultGitHubIssuesCollator implements DocumentCollator {
  public readonly type = 'github-issue';
  gitHubService: GitHubService;
  collator: any;

  constructor(token: string) {
    this.gitHubService = new GitHubService(token);
  }

  static fromConfig(config: Config) {
    return new DefaultGitHubIssuesCollator(
      (config.get('integrations.github') as GitHubIntegrationConfig)[0].token,
    );
  }

  async execute(): Promise<GitHubIssueDocument[]> {
    const result = await this.gitHubService.getOpenIssues(
      gitHubRepositoryName,
      gitHubRepositoryOwner,
    );

    return result;
  }
}
