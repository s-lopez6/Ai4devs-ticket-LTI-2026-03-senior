import React from 'react';
import { Button, Card, CardActions, CardContent, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function HomePage(): JSX.Element {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h3" component="h1">
          Talent Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome. Start by adding a candidate.
        </Typography>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h2">
              Add Candidate
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a candidate profile with the MVP fields.
            </Typography>
          </CardContent>
          <CardActions>
            <Button component={RouterLink} to="/candidates/new" variant="contained">
              Add Candidate
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </Container>
  );
}
