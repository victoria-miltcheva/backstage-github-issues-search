import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box,
  Chip,
  makeStyles,
} from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { Link } from '@backstage/core-components';
import { gitHubIssueResultBodyCharLimit } from '../constants/limits';

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    marginBottom: '1rem',
  },
});

function GitHubIssueResultListItem({ result }: { result: any }) {
  const classes = useStyles();

  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start" className={classes.flexContainer}>
        <Link to={result.author.profileUrl}>
          <ListItemAvatar>
            <Avatar alt={result.author.userId} src={result.author.avatarUrl} />
          </ListItemAvatar>
          <ListItemText primary={result.author.userId} />
        </Link>
        <ListItemText
          className={classes.itemText}
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={
            result.body.length < gitHubIssueResultBodyCharLimit
              ? result.body
              : `${result.body.substr(0, gitHubIssueResultBodyCharLimit)}...`
          }
        />
        <Box>
          {result.status && (
            <Chip label={`Status: ${result.status}`} size="small" />
          )}
        </Box>
      </ListItem>
      <Divider component="li" />
    </Link>
  );
}

export { GitHubIssueResultListItem };
