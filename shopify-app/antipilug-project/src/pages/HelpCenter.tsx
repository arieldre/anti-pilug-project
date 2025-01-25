import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { School, VideoLibrary, People, Search, Book, HelpOutline } from "@mui/icons-material";
import './HelpCenter.scss';

const HelpCenter: React.FC = () => {
  const helpSections = [
    {
      title: "Courses",
      description: "The courses are meant to improve self-development by viewing videos of experts in the field.",
      icon: <School className="icon" />,
    },
    {
      title: "Videos",
      description: "Watch videos presenting different opinions on politics to foster understanding.",
      icon: <VideoLibrary className="icon" />,
    },
    {
      title: "Matchmaking",
      description:
        "Find a match with someone who has a different political stand. Engage in a video conversation to promote dialogue.",
      icon: <People className="icon" />,
    },
    {
      title: "Research",
      description: "Explore research to bridge divides and foster understanding among people with different views.",
      icon: <Book className="icon" />,
    },
    {
      title: "Search",
      description: "Find videos and people to match with using the search feature.",
      icon: <Search className="icon" />,
    },
    {
      title: "Need More Help?",
      description: "Contact our support team for additional assistance.",
      icon: <HelpOutline className="icon" />,
    },
  ];

  return (
    <div className="help-center">
      <header className="header">
        <Typography variant="h3" component="h1" className="title">
          Help Center
        </Typography>
        <Typography variant="body1" className="subtitle">
          Find information on how to use the various features of our app.
        </Typography>
      </header>

      <Grid container spacing={3} justifyContent="center">
        {helpSections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="help-card">
              <CardContent className="card-content">
                {section.icon}
                <Typography variant="h6" className="card-title">
                  {section.title}
                </Typography>
                <Typography variant="body2" className="card-description">
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HelpCenter;
