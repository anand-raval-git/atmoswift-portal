import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Shield, Zap, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ProjectOverview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-sky dark:text-cyan" />
            SkyPulse Weather Deployment with DevSecOps Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              SkyPulse Weather was deployed using a comprehensive DevSecOps pipeline, integrating security 
              into every stage of the CI/CD workflow. This project demonstrates modern deployment practices 
              with automated builds, security scanning, and containerized deployment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <Zap className="h-8 w-8 text-sky dark:text-cyan" />
                <div>
                  <h4 className="font-semibold text-foreground">Automated CI/CD</h4>
                  <p className="text-sm text-muted-foreground">Jenkins pipeline automation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <Shield className="h-8 w-8 text-sky dark:text-cyan" />
                <div>
                  <h4 className="font-semibold text-foreground">Security Scanning</h4>
                  <p className="text-sm text-muted-foreground">Vulnerability assessment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <Lock className="h-8 w-8 text-sky dark:text-cyan" />
                <div>
                  <h4 className="font-semibold text-foreground">Secure Deployment</h4>
                  <p className="text-sm text-muted-foreground">Containerized with Docker</p>
                </div>
              </div>
            </div>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-sky/20 dark:border-cyan/20 hover:bg-sky/10 dark:hover:bg-cyan/10"
                >
                  <span>View Technical Details</span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="bg-card/30 p-6 rounded-lg border border-border/50">
                  <h4 className="text-lg font-semibold mb-4 text-foreground">DevSecOps Pipeline Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Security Integration</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Vulnerability scanning with Trivy</li>
                        <li>• Code quality analysis with SonarQube</li>
                        <li>• Dependency security checks</li>
                        <li>• Container image scanning</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Deployment Process</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Docker containerization</li>
                        <li>• Automated testing pipeline</li>
                        <li>• Secure environment deployment</li>
                        <li>• Monitoring and alerting</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/30 p-6 rounded-lg border border-border/50">
                  <h4 className="text-lg font-semibold mb-4 text-foreground">Pipeline Architecture</h4>
                  <div className="bg-background/50 p-4 rounded-lg border border-border/30">
                    <div className="text-center">
                      <img
                        src="/devsecops-pipeline.svg"
                        alt="DevSecOps: Integrating Security in CI/CD Pipeline"
                        className="w-full max-w-4xl mx-auto rounded-lg border border-border/20 bg-slate-800"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                      />
                      <p className="text-sm text-muted-foreground mt-4">
                        Application Stack (GitHub, React, JavaScript) → DevSecOps Pipeline (TRIVY, OWASP, SONAR, Testing) → Docker Deployment → Access Control
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                asChild 
                className="bg-sky hover:bg-sky/90 dark:bg-cyan dark:hover:bg-cyan/90 text-white"
              >
                <a 
                  href="https://github.com/anand-raval-git/SkyPulseWeather-Docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Documentation
                </a>
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="border-sky/20 dark:border-cyan/20 hover:bg-sky/10 dark:hover:bg-cyan/10"
              >
                <a 
                  href="https://github.com/anand-raval-git" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  GitHub Profile
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
