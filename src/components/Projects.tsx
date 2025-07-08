
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectOverview from './ProjectOverview';
import ToolsUsed from './ToolsUsed';

const Projects: React.FC = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "My professional portfolio showcasing skills and experience",
      link: "https://anandraval.me",
    },
    {
      title: "URL Shortener",
      description: "A tool to create shortened URLs for easier sharing",
      link: "https://short.anandraval.me",
    }
  ];

  return (
    <section className="py-8">
      <ProjectOverview />
      <ToolsUsed />

      {/* My Projects Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-sky dark:text-cyan">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="glass-panel border border-input hover:border-sky dark:hover:border-cyan transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="font-heading">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sky dark:text-cyan hover:underline transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {project.link}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
