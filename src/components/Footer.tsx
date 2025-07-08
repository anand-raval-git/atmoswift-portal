
import React from 'react';
import { Github, Linkedin, Mail, Phone, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 border-t border-input">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} SkyPulse Weather. Deployed with a DevSecOps Pipeline.
              </p>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sky dark:text-cyan">Contact Information</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="mailto:anandraval.work@gmail.com" 
                    className="flex items-center gap-2 text-muted-foreground hover:text-sky dark:hover:text-cyan transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    anandraval.work@gmail.com
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+917874065192" 
                    className="flex items-center gap-2 text-muted-foreground hover:text-sky dark:hover:text-cyan transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    +91 7874065192
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sky dark:text-cyan">Follow Me</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://github.com/anand-raval-git" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-sky dark:hover:text-cyan transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/anand-raval-70751725a" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-sky dark:hover:text-cyan transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="https://anandraval.hashnode.dev/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-sky dark:hover:text-cyan transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-center text-xs text-muted-foreground">
            Built by Shivit using OpenWeatherMap API and Deployed by Anand Raval with DevSecOps best practices
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
