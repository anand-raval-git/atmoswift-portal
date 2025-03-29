
import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} SkyPulse Weather. Built and Deployed by Anand Raval using OpenWeatherMap API.
            </p>
          </div>
          
          <div className="flex gap-3">
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-sky dark:hover:text-cyan transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-sky dark:hover:text-cyan transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
