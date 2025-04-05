# AtmoSwift Weather Portal

AtmoSwift Weather Portal is a modern, responsive weather application built with React, TypeScript, and Tailwind CSS. It provides real-time weather data and forecasts using the OpenWeatherMap API.

![AtmoSwift Weather Portal](https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png)

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Local Development](#local-development)
- [Deployment](#deployment)
  - [Docker Containerization](#docker-containerization)
  - [CI/CD with Jenkins](#cicd-with-jenkins)
  - [Security Considerations](#security-considerations)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Current Weather Data**: Display real-time weather conditions including temperature, humidity, wind speed, and more
- **7-Day Forecast**: View weather forecasts for the upcoming week
- **Hourly Forecast**: Check detailed hourly weather predictions
- **Location Search**: Search for weather data by city name
- **Geolocation Support**: Get weather data for your current location
- **Search History**: View and access your recent location searches
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Light/Dark Mode**: Toggle between light and dark themes
- **Unit Conversion**: Switch between metric and imperial units

## Architecture

AtmoSwift Weather Portal follows a client-server architecture:

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **Context API**: For state management across components

### Backend
- **Node.js**: JavaScript runtime for the backend
- **Express**: Web framework for creating the API proxy
- **Axios**: HTTP client for making API requests

### API
- **OpenWeatherMap API**: External service providing weather data
- **Proxy Server**: Secures API keys and handles requests to OpenWeatherMap

## Local Development

To set up the project for local development:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/atmoswift-portal.git
   cd atmoswift-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For the backend proxy server:
   ```bash
   cd server
   npm install
   npm run dev
   ```

## Deployment

AtmoSwift Weather Portal is designed for easy deployment using Docker and Jenkins for CI/CD.

### Docker Containerization

The application is containerized using Docker for consistent deployment across environments.

#### Frontend Dockerfile

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile

```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --only=production

COPY server .

EXPOSE 3000
CMD ["node", "index.js"]
```

#### Docker Compose

For local testing of the containerized application:

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://backend:3000/api

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3000:3000"
    environment:
      - OPENWEATHER_API_KEY=${OPENWEATHER_API_KEY}
```

### Building and Pushing Docker Images

To build and push the Docker images to Docker Hub:

1. Build the images:
   ```bash
   docker build -t yourusername/atmoswift-frontend:latest -f Dockerfile.frontend .
   docker build -t yourusername/atmoswift-backend:latest -f Dockerfile.backend .
   ```

2. Push to Docker Hub:
   ```bash
   docker login
   docker push yourusername/atmoswift-frontend:latest
   docker push yourusername/atmoswift-backend:latest
   ```

### CI/CD with Jenkins

AtmoSwift Weather Portal uses Jenkins for continuous integration and deployment with a focus on security (DevSecOps).

#### Jenkinsfile

```groovy
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
```

### Security Considerations

The DevSecOps pipeline includes several security measures:

1. **Dependency Scanning**: npm audit and OWASP Dependency-Check to identify vulnerable dependencies
2. **Static Code Analysis**: ESLint and TypeScript type checking to catch potential issues
3. **Container Scanning**: Trivy scans Docker images for vulnerabilities
4. **Secret Management**: API keys and credentials are stored securely in Jenkins credentials store
5. **API Key Protection**: Backend proxy prevents exposing API keys in client-side code

## Environment Variables

### Frontend

| Variable | Description | Default |
|----------|-------------|----------|
| VITE_API_BASE_URL | URL of the backend API | http://localhost:3000/api |

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| OPENWEATHER_API_KEY | OpenWeatherMap API key | Yes |
| PORT | Port for the backend server | 3000 |

## API Integration

AtmoSwift Weather Portal integrates with the following OpenWeatherMap API endpoints:

1. **Current Weather**: `/data/2.5/weather`
2. **5-Day Forecast**: `/data/2.5/forecast`
3. **Geocoding**: `/geo/1.0/direct`
4. **Reverse Geocoding**: `/geo/1.0/reverse`

The backend proxy server secures the API key and handles all requests to these endpoints.

## How It Works

1. **User Interface**: The React frontend provides an intuitive interface for users to search for locations and view weather data.

2. **Data Flow**:
   - User enters a city name in the search bar
   - Frontend sends a request to the backend proxy
   - Backend proxy adds the API key and forwards the request to OpenWeatherMap
   - OpenWeatherMap returns weather data
   - Backend proxy forwards the data to the frontend
   - Frontend displays the weather information

3. **Search History**:
   - Recent searches are stored in localStorage
   - When the user clicks on the search bar, previous searches are displayed
   - Clicking on a previous search loads weather data for that location

4. **Responsive Design**:
   - The application adapts to different screen sizes
   - Mobile-first approach ensures good user experience on all devices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
