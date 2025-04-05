pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        OPENWEATHER_API_KEY = credentials('openweather-api-key')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Static Code Analysis') {
            steps {
                sh 'npm run lint'
                sh 'npm run type-check'
            }
        }
        
        stage('Security Scan') {
            steps {
                // Run npm audit to check for vulnerabilities
                sh 'npm audit --audit-level=high'
                
                // Run OWASP Dependency-Check
                dependencyCheck additionalArguments: '--scan ./ --format XML', odcInstallation: 'OWASP-Dependency-Check'
                
                // Publish the results
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh 'docker build -t yourusername/atmoswift-frontend:${BUILD_NUMBER} -t yourusername/atmoswift-frontend:latest -f Dockerfile.frontend .'
                sh 'docker build -t yourusername/atmoswift-backend:${BUILD_NUMBER} -t yourusername/atmoswift-backend:latest -f Dockerfile.backend .'
            }
        }
        
        stage('Docker Security Scan') {
            steps {
                // Run Trivy scanner on Docker images
                sh 'trivy image --severity HIGH,CRITICAL yourusername/atmoswift-frontend:${BUILD_NUMBER}'
                sh 'trivy image --severity HIGH,CRITICAL yourusername/atmoswift-backend:${BUILD_NUMBER}'
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKER_HUB_CREDS_PSW | docker login -u $DOCKER_HUB_CREDS_USR --password-stdin'
                sh 'docker push yourusername/atmoswift-frontend:${BUILD_NUMBER}'
                sh 'docker push yourusername/atmoswift-frontend:latest'
                sh 'docker push yourusername/atmoswift-backend:${BUILD_NUMBER}'
                sh 'docker push yourusername/atmoswift-backend:latest'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                // Deploy using kubectl or other deployment tools
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl set image deployment/atmoswift-frontend frontend=yourusername/atmoswift-frontend:${BUILD_NUMBER}'
                sh 'kubectl set image deployment/atmoswift-backend backend=yourusername/atmoswift-backend:${BUILD_NUMBER}'
            }
        }
    }
    
    post {
        always {
            // Clean up Docker images
            sh 'docker rmi yourusername/atmoswift-frontend:${BUILD_NUMBER} yourusername/atmoswift-backend:${BUILD_NUMBER} || true'
            
            // Send notifications
            emailext (
                subject: "Build ${currentBuild.result}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>Build Status: ${currentBuild.result}</p>
                         <p>Build Number: ${env.BUILD_NUMBER}</p>
                         <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}
