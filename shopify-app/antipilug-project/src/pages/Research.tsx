import React from 'react';
import { Typography, Container, Link } from '@mui/material';

const Research: React.FC = () => {
  return (
    <Container sx={{ paddingTop: '80px' }}>
      <Typography variant="h4" gutterBottom>
        Research
      </Typography>
      <Typography variant="body2" paragraph>
        Our research aimed to bridge divides and foster understanding among people with different political views. We divided participants into two groups based on their political beliefs.
      </Typography>
      <Typography variant="body2" paragraph>
        The study consisted of five rounds, each lasting six minutes. In each round, participants from both groups were given three minutes to share stories on a chosen topic. The goal was for participants to find similarities between themselves and others, and by the end of the five rounds, to realize that they have commonalities not just with one person from the other group, but potentially with everyone.
      </Typography>
      <Typography variant="body2" paragraph>
        The goal of the research was to create a feeling called "kama muta". Kama muta is our scientific name for an emotion that has names in many languages (but not all). In English, it overlaps closely with being moved to tears. This feeling has been checked in previous research and exists globally.
      </Typography>
      <Typography variant="body2" paragraph>
        This method was designed to help participants understand that despite their differences, they share many common goals and values. The results of this research will be added soon.
      </Typography>
      <Typography variant="body2" paragraph>
        This is the latest study about kama muta: Blomster Lyshol, J. K., Seibt, B., Oliver, M. B., & Thomsen, L. (2022). Moving political opponents closer: How kama muta can contribute to reducing the partisan divide in the US. Group Processes & Intergroup Relations. <Link href="https://doi.org/10.1177/13684302211067152" target="_blank" rel="noopener">https://doi.org/10.1177/13684302211067152</Link>
      </Typography>
    </Container>
  );
};

export default Research;