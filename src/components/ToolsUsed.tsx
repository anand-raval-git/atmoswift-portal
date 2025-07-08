import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

const ToolsUsed: React.FC = () => {
  const tools = [
    {
      name: 'Jenkins',
      description: 'CI/CD Automation',
      icon: '🔧', // We'll use emoji for now, can be replaced with actual icons
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Docker',
      description: 'Containerization',
      icon: '🐳',
      color: 'from-blue-400 to-blue-500'
    },
    {
      name: 'AWS',
      description: 'Cloud Infrastructure',
      icon: '☁️',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Trivy',
      description: 'Security Scanning',
      icon: '🛡️',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'SonarQube',
      description: 'Code Quality',
      icon: '📊',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'React',
      description: 'Frontend Framework',
      icon: '⚛️',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      name: 'TypeScript',
      description: 'Type Safety',
      icon: '📘',
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Tailwind CSS',
      description: 'Styling Framework',
      icon: '🎨',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <div className="mt-8">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="h-6 w-6 text-sky dark:text-cyan" />
            Tools & Technologies Used
          </CardTitle>
          <p className="text-muted-foreground">
            These tools were instrumental in building, securing, and deploying SkyPulse Weather efficiently.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/30 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-sky/30 dark:hover:border-cyan/30"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                      {tool.icon}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky/20 to-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-card/20 rounded-lg border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-sky dark:bg-cyan rounded-full"></div>
              <h4 className="font-medium text-foreground">DevSecOps Pipeline Integration</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Each tool plays a crucial role in the automated pipeline: Jenkins orchestrates the workflow, 
              Docker ensures consistent deployments, AWS provides scalable infrastructure, Trivy and SonarQube 
              maintain security and quality standards, while React, TypeScript, and Tailwind CSS deliver 
              a modern, responsive user experience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsUsed;
