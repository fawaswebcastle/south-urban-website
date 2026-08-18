pipeline {
    agent any

    environment {
        GITLAB_PROJECT_ID = '85415110'
        PROJECT_NAME = 'South_Urban'
        DEPLOY_SERVER = "${env.DEPLOY_SERVER ?: 's503'}"
        DEPLOY_TIMEOUT = '30s'
        APP_PORT = '3000'
        CONTAINER_NAME = "${env.PROJECT_NAME}"
        SONAR_PROJECT_KEY = 'muthoot-exim-api'
        SONAR_PROJECT_NAME = 'muthoot-exim-api'
        GC_WEBHOOK = 'https://chat.googleapis.com/v1/spaces/AAQAIvrW4tc/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=HJtLSDw11ulVpTnVWJtU4ukWMUGnjo8mEUkhNz0hTyk'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Load Env From GitLab') {
            steps {
                script {
                    loadGitLabEnv(env.GITLAB_PROJECT_ID)
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                branch 'develop2'
            }
            steps {
                script {
                    timeout(time: 10, unit: 'MINUTES') {
                        echo 'Starting SonarQube analysis...'
                        echo 'Using sonar-project.properties file...'
                        
                        def scannerPath = ""
                        try {
                            def scannerHome = tool 'SonarScanner'
                            scannerPath = "${scannerHome}/bin/sonar-scanner"
                            echo "✅ Using SonarScanner tool at ${scannerPath}"
                        } catch (Exception e) {
                            try {
                                def scannerHome = tool 'sonar-scanner'
                                scannerPath = "${scannerHome}/bin/sonar-scanner"
                                echo "✅ Using sonar-scanner tool at ${scannerPath}"
                            } catch (Exception e2) {
                                echo "⚠️ Tool 'sonar-scanner' not found, falling back to system path 'sonar-scanner'..."
                                scannerPath = "sonar-scanner"
                            }
                        }

                        withSonarQubeEnv(credentialsId: 'sonarqube') {
                            sh """
                                export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
                                export PATH=\$JAVA_HOME/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

                                java -version || true
                                node -v || true
                                git --version || true

                                ${scannerPath} \\
                                  -Dsonar.projectKey=${env.SONAR_PROJECT_KEY} \\
                                  -Dsonar.projectName="${env.SONAR_PROJECT_NAME}" \\
                                  -Dsonar.sources=. \\
                                  -Dsonar.exclusions=**/node_modules/**,**/.next/**,**/dist/**,**/build/** \\
                                  -Dsonar.nodejs.executable=/usr/bin/node \\
                                  -Dsonar.scanner.skipNodeProvisioning=true \\
                                  -Dsonar.scanner.skipJreProvisioning=true \\
                                  -Dsonar.scm.provider=git
                            """
                        }
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    def buildArgNames = [] // API usually doesn't need build args, uses runtime env
                    def buildArgs = []
                    buildArgNames.each { argName ->
                        def val = getEnvVarFromGitLab(argName)
                        if (val) {
                            buildArgs << "--build-arg"
                            buildArgs << "${argName}=${val}"
                            echo "✅ Loaded ${argName} from GitLab"
                        }
                    }

                    echo "🔨 Building Docker image for ${env.PROJECT_NAME}..."
                    
                    // Generate date and time for container name and build tag
                    def buildDate = sh(
                        script: 'date +%Y%m%d-%H%M%S',
                        returnStdout: true
                    ).trim()
                    env.BUILD_DATE = buildDate
                    env.BUILD_TAG = "build-${buildDate}"
                    
                    // Create test container name with format: test-container-projectname-dateandtime
                    env.TEST_CONTAINER_NAME = "test-container-${env.PROJECT_NAME}-${buildDate}"
                    
                    def buildCmd = "docker build -f infra/docker/Dockerfile -t ${env.PROJECT_NAME} ${buildArgs.join(' ')} ./api"
                    sh buildCmd
                    
                    echo "✅ Docker build completed successfully!"
                    echo "📅 Build date - ${env.BUILD_DATE}"
                    echo "🏷️  Build tag - ${env.BUILD_TAG}"
                }
            }
        }

        stage('Test Container') {
            steps {
                script {
                    echo "🧪 Testing the built image..."
                    
                    // Build environment variables from gitlab.env
                    def envFlags = getDockerEnvFlags()
                    
                    // Build docker run command
                    def dockerRunParts = [
                        "docker run -d",
                        "--name ${env.TEST_CONTAINER_NAME}"
                        // "-p 9999:3000"
                    ]
                    
                    // Add environment variables if any
                    if (envFlags.size() > 0) {
                        dockerRunParts.addAll(envFlags)
                    }
                    
                    dockerRunParts.add("${env.PROJECT_NAME}")
                    
                    def dockerRunCmd = dockerRunParts.join(' ')
                    sh dockerRunCmd
                    
                    echo "⏳ Container started in detached mode. Checking status for 30 seconds..."
                    def containerRunning = true
                    for (int i = 1; i <= 5; i++) {
                        echo "Check ${i}/5: Container status check..."
                        def status = sh(
                            script: "docker ps | grep -q ${env.TEST_CONTAINER_NAME} && echo 'running' || echo 'stopped'",
                            returnStdout: true
                        ).trim()
                        
                        if (status == 'running') {
                            echo "✅ Container is running (check ${i}/5)"
                            if (i == 5) {
                                echo "✅ Container test completed successfully after 30 seconds"
                            }
                        } else {
                            echo "❌ Container stopped unexpectedly (check ${i}/5)"
                            sh "docker logs ${env.TEST_CONTAINER_NAME} || true"
                            sh "docker rm ${env.TEST_CONTAINER_NAME} || true"
                            containerRunning = false
                            error("Container test failed")
                        }
                        sleep(6)
                    }
                    
                    echo "✅ Container test completed successfully"
                    sh """
                        docker stop ${env.TEST_CONTAINER_NAME} || true
                        docker rm ${env.TEST_CONTAINER_NAME} || true
                    """
                }
            }
            post {
                always {
                    // Cleanup container in case of failure
                    sh """
                        docker stop ${env.TEST_CONTAINER_NAME} || true
                        docker rm ${env.TEST_CONTAINER_NAME} || true
                    """
                }
            }
        }


        stage('Push to GitLab Registry') {
            steps {
                script {
                    echo "📤 Pushing to GitLab Container Registry..."
                    
                    try {
                        def ciRegistry = getEnvVarFromGitLab('CI_REGISTRY')
                        if (!ciRegistry || ciRegistry.trim().isEmpty()) {
                            error("CI_REGISTRY is not set in GitLab variables. Please set it in GitLab CI/CD variables.")
                        }
                        env.CI_REGISTRY = ciRegistry
                        echo "✅ Loaded CI_REGISTRY from GitLab: ${ciRegistry}"
                        
                        // Construct registry image path
                        def registryUrl = env.CI_REGISTRY.replaceAll(/^https?:\/\//, '').replaceAll(/\/$/, '')
                        env.CI_REGISTRY_IMAGE = "${registryUrl}/${env.PROJECT_NAME}"

                        // Extract registry host for login (take the first part before any slash)
                        def registryHost = registryUrl.split('/')[0]

                        echo "📦 Registry Image Path: ${env.CI_REGISTRY_IMAGE}"
                        echo "🔑 Registry Host for Login: ${registryHost}"
                        
                        withCredentials([
                            string(credentialsId: 'CI_REGISTRY_USER', variable: 'CI_REGISTRY_USER'),
                            string(credentialsId: 'CI_REGISTRY_PASSWORD', variable: 'CI_REGISTRY_PASSWORD')
                        ]) {
                            echo "🔐 Logging into Docker registry..."
                            sh "echo '${env.CI_REGISTRY_PASSWORD}' | docker login -u '${env.CI_REGISTRY_USER}' --password-stdin ${registryHost}"
                            
                            // Tag the image with date
                            echo "🏷️  Tagging image with date - ${env.BUILD_TAG}"
                            sh "docker tag ${env.PROJECT_NAME} ${env.CI_REGISTRY_IMAGE}:${env.BUILD_TAG}"
                            
                            // Check if latest tag exists and rename it to previous
                            echo "🔄 Managing latest tag..."
                            def latestExists = sh(
                                script: "docker pull ${env.CI_REGISTRY_IMAGE}:latest 2>/dev/null && echo 'exists' || echo 'not_exists'",
                                returnStdout: true
                            ).trim()
                            
                            if (latestExists == 'exists') {
                                echo "📦 Previous latest image found, renaming to previous..."
                                sh "docker tag ${env.CI_REGISTRY_IMAGE}:latest ${env.CI_REGISTRY_IMAGE}:previous || echo 'No previous tag to rename'"
                            } else {
                                echo "📦 No previous latest image found"
                            }
                            
                            // Tag current image as latest
                            echo "🏷️  Tagging current image as latest"
                            sh "docker tag ${env.PROJECT_NAME} ${env.CI_REGISTRY_IMAGE}:latest"
                            
                            // Push both tags to registry
                            echo "📤 Pushing images to Container Registry..."
                            sh "docker push ${env.CI_REGISTRY_IMAGE}:${env.BUILD_TAG}"
                            sh "docker push ${env.CI_REGISTRY_IMAGE}:latest"
                            echo "✅ Images pushed successfully!"
                            echo "📋 Pushed tags - ${env.BUILD_TAG}, latest"
                        }
                    } catch (Exception e) {
                        echo "⚠️  Warning: Could not push to registry - ${e.getMessage()}"
                        echo "📦 Image built and tested successfully, but not pushed to registry"
                        echo "💡 To enable registry push, configure CI_REGISTRY in GitLab variables and CI_REGISTRY_USER, CI_REGISTRY_PASSWORD in Jenkins credentials"
                        throw e
                    }
                }
            }
            post {
                success {
                    echo "✅ Pushed to GitLab Container Registry successfully!"
                }
                failure {
                    echo "❌ Failed to push to GitLab Container Registry!"
                }
            }
        }

        stage('Deploy') {
            agent any
            when {
                branch 'develop-v2'
            }
            steps {
                script {
                    def deployServer = env.DEPLOY_SERVER ?: 's503'
                    def sshCredentialsId = "${deployServer}_SSH"
                    
                    // Determine FQDN target hostname (e.g. s503 -> s503.previewbay.com, or keep if already FQDN/IP)
                    def targetHostName = env.DEPLOY_SERVER_HOST ?: (deployServer.contains('.') ? deployServer : "${deployServer}.previewbay.com")
                    def previewDomain = "${env.PROJECT_NAME}.${deployServer}.previewbay.com"
                    def previewUrl = "http://${previewDomain}"
                    
                    echo "🚀 Starting deployment stage for target server: ${deployServer}..."
                    echo "🎯 Target Hostname: ${targetHostName}"
                    echo "🔑 SSH Credential ID: ${sshCredentialsId}"
                    echo "🌐 Preview Domain: ${previewUrl}"

                    // Load GitLab environment variables using the reusable function
                    loadGitLabEnv(env.GITLAB_PROJECT_ID)

                    // Get CI_REGISTRY from gitlab.env
                    def ciRegistry = getEnvVarFromGitLab('CI_REGISTRY')
                    if (!ciRegistry || ciRegistry.trim().isEmpty()) {
                        error("CI_REGISTRY is missing in GitLab variables. Please set it in GitLab CI/CD variables.")
                    }

                    env.CI_REGISTRY = ciRegistry
                    def registryUrl = ciRegistry.replaceAll(/^https?:\/\//, '').replaceAll(/\/$/, '')
                    def registryHost = registryUrl.split('/')[0]
                    env.CI_REGISTRY_IMAGE = "${registryUrl}/${env.PROJECT_NAME}"

                    def latestTagName = "latest"

                    // Expose non-secret values to pipeline environment for sh steps
                    env.DEPLOY_TARGET_HOST = targetHostName
                    env.DEPLOY_PREVIEW_DOMAIN = previewDomain
                    env.DEPLOY_PREVIEW_URL = previewUrl
                    env.DEPLOY_REGISTRY_HOST = registryHost
                    env.DEPLOY_LATEST_TAG = latestTagName

                    withCredentials([
                        sshUserPrivateKey(credentialsId: sshCredentialsId, keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER'),
                        string(credentialsId: 'CI_REGISTRY_USER', variable: 'CI_REGISTRY_USER'),
                        string(credentialsId: 'CI_REGISTRY_PASSWORD', variable: 'CI_REGISTRY_PASSWORD')
                    ]) {
                        sh '''
                            set -e

                            USER_NAME="${SSH_USER:-root}"
                            REMOTE_HOST="${DEPLOY_TARGET_HOST}"
                            SSH_CMD="ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${USER_NAME}@${REMOTE_HOST}"
                            SCP_CMD="scp -o StrictHostKeyChecking=no -i ${SSH_KEY}"

                            echo "🎯 Target Host: ${USER_NAME}@${REMOTE_HOST}"

                            echo "📁 Step 1: Creating /opt/${PROJECT_NAME} and persistent storage directories..."
                            $SSH_CMD "mkdir -p /opt/${PROJECT_NAME}/uploads /opt/${PROJECT_NAME}/data"

                            echo "📄 Step 2: Transferring gitlab.env to remote /opt/${PROJECT_NAME}/.env..."
                            $SCP_CMD gitlab.env "${USER_NAME}@${REMOTE_HOST}:/opt/${PROJECT_NAME}/.env"

                            echo "🔗 Step 3: Ensuring PUBLIC_URL is configured in remote .env..."
                            $SSH_CMD 'bash -s' "${DEPLOY_PREVIEW_URL}" "${PROJECT_NAME}" << 'REMOTE_EOF'
                                PREVIEW_URL="$1"
                                PROJ_NAME="$2"
                                ENV_FILE="/opt/${PROJ_NAME}/.env"

                                if ! grep -q '^PUBLIC_URL=' "$ENV_FILE"; then
                                    echo "PUBLIC_URL=${PREVIEW_URL}" >> "$ENV_FILE"
                                    echo "✅ Appended PUBLIC_URL=${PREVIEW_URL} to .env"
                                else
                                    echo "ℹ️ PUBLIC_URL already present in .env"
                                fi
REMOTE_EOF

                            echo "🔐 Step 4: Authenticating with GitLab Container Registry on target server..."
                            $SSH_CMD "echo '${CI_REGISTRY_PASSWORD}' | docker login -u '${CI_REGISTRY_USER}' --password-stdin ${DEPLOY_REGISTRY_HOST}"

                            echo "📥 Step 5: Pulling latest Docker image (${CI_REGISTRY_IMAGE}:${DEPLOY_LATEST_TAG})..."
                            $SSH_CMD "docker pull ${CI_REGISTRY_IMAGE}:${DEPLOY_LATEST_TAG}"

                            echo "🛑 Step 6: Stopping and removing existing container (${CONTAINER_NAME})..."
                            $SSH_CMD "docker stop ${CONTAINER_NAME} || true && docker rm ${CONTAINER_NAME} || true"

                            echo "🚀 Step 7: Starting new Docker container with mounted volumes..."
                            $SSH_CMD 'bash -s' "${PROJECT_NAME}" "${CONTAINER_NAME}" "${CI_REGISTRY_IMAGE}" "${DEPLOY_LATEST_TAG}" << 'REMOTE_EOF'
                                PROJ_NAME="$1"
                                CONT_NAME="$2"
                                IMG_NAME="$3"
                                TAG_NAME="$4"

                                docker network create nginx-network 2>/dev/null || true
                                docker run -d \
                                    --name "$CONT_NAME" \
                                    --restart unless-stopped \
                                    --network nginx-network \
                                    --env-file "/opt/${PROJ_NAME}/.env" \
                                    -v "/opt/${PROJ_NAME}/uploads:/app/uploads" \
                                    -v "/opt/${PROJ_NAME}/data:/app/data" \
                                    "${IMG_NAME}:${TAG_NAME}"
REMOTE_EOF

                            echo "🧪 Step 8: Verifying container execution..."
                            IS_RUNNING=$($SSH_CMD "docker inspect -f '{{.State.Running}}' ${CONTAINER_NAME} 2>/dev/null || echo false")
                            if [ "$IS_RUNNING" != "true" ]; then
                                echo "❌ Container failed to start or exited unexpectedly. Outputting container logs:"
                                $SSH_CMD "docker logs ${CONTAINER_NAME} || true"
                                exit 1
                            fi
                            echo "✅ Container ${CONTAINER_NAME} is running successfully!"

                            echo "🔧 Step 9: Automatically configuring Nginx using add-app.sh..."
                            $SSH_CMD 'bash -s' "${DEPLOY_PREVIEW_DOMAIN}" "${APP_PORT}" "${CONTAINER_NAME}" << 'REMOTE_EOF'
                                DOMAIN="$1"
                                PORT="$2"
                                CONTAINER="$3"

                                NGINX_DIR=""
                                for dir in /root/nginx /home/nginx /opt/nginx /etc/nginx "$HOME/nginx"; do
                                    if [ -f "$dir/add-app.sh" ]; then
                                        NGINX_DIR="$dir"
                                        break
                                    fi
                                done

                                if [ -n "$NGINX_DIR" ] && [ -f "$NGINX_DIR/add-app.sh" ]; then
                                    echo "✅ Found add-app.sh in $NGINX_DIR. Configuring Nginx for $DOMAIN..."
                                    cd "$NGINX_DIR" && ./add-app.sh "$DOMAIN" "$PORT" "$CONTAINER"
                                else
                                    echo "⚠️ add-app.sh script not found in standard directories. Skipping Nginx auto-configuration."
                                fi
REMOTE_EOF

                            echo "🎉 Deployment to ${REMOTE_HOST} completed successfully!"
                            echo "🌐 Application live at: ${DEPLOY_PREVIEW_URL}"
                        '''
                    }
                }
            }
        }
    
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
            script {
                def deployServer = env.DEPLOY_SERVER ?: 's503'
                // Avoid using rawBuild (not allowed in sandbox); construct URL from known env
                def websiteUrl = ""
                if (env.CONTAINER_NAME?.trim()) {
                    websiteUrl = "http://${env.CONTAINER_NAME}.${deployServer}.previewbay.com"
                } else if (env.PROJECT_NAME?.trim()) {
                    websiteUrl = "http://${env.PROJECT_NAME}.${deployServer}.previewbay.com"
                } else {
                    websiteUrl = "URL_NOT_AVAILABLE"
                }
                
                // Read log content to include in Google Chat (prefer console.log, fallback to build.log)
                def logText = ""
                try {
                    if (fileExists('console.log')) {
                        logText = readFile('console.log')
                    } else if (fileExists('build.log')) {
                        logText = readFile('build.log')
                    } else {
                        logText = "Log file not found in workspace."
                    }
                    // Limit log size to last 2000 characters to avoid message size limits
                    if (logText.length() > 2000) {
                        logText = "... (truncated) ...\n" + logText.substring(logText.length() - 2000)
                    }
                } catch (Exception e) {
                    echo "⚠️  Warning: Could not read log file for chat notification - ${e.getMessage()}"
                    logText = "Error reading log file: ${e.getMessage()}"
                }
                
                if (env.GC_WEBHOOK?.trim()) {
                    try {
                        // Write message to file first to avoid escaping issues
                        writeFile file: 'gc_msg.txt', text: """🟢 *BUILD SUCCESS*
*Job:* ${env.JOB_NAME}
*Build:* #${env.BUILD_NUMBER}
*Website:* ${websiteUrl}
🔗 *Build URL:* ${env.BUILD_URL}
*Log:*
${logText}"""
                        
                        // Use jq to properly construct JSON payload and send notification
                        def curlResult = sh(
                            script: """
                                jq -Rs '{text: .}' gc_msg.txt > gc_payload.json
                                curl -X POST -H "Content-Type: application/json" \\
                                     -d @gc_payload.json \\
                                     -w "\\nHTTP Status: %{http_code}\\n" \\
                                     "${env.GC_WEBHOOK}"
                                rm -f gc_msg.txt gc_payload.json
                            """,
                            returnStatus: true
                        )
                        
                        if (curlResult == 0) {
                            echo "✅ Success notification sent to Google Chat"
                        } else {
                            echo "⚠️  Failed to send success notification (curl exit code: ${curlResult})"
                        }
                    } catch (Exception e) {
                        echo "⚠️  Error sending success notification: ${e.getMessage()}"
                    }
                } else {
                    echo "⚠️  GC_WEBHOOK is not configured; skipping success notification."
                }
            }
        }
        failure {
            echo 'Pipeline failed!'
            script {
                // Read full pipeline log artifact to include in Google Chat
                def logText = ""
                try {
                    if (fileExists('pipeline.log')) {
                        // Full pipeline log captured from Jenkins console output
                        logText = readFile('pipeline.log')
                    } else if (fileExists('build.log')) {
                        // Fallback to generic build.log if pipeline.log is missing
                        logText = readFile('build.log')
                    } else if (fileExists('console.log')) {
                        // Last resort: summary console.log
                        logText = readFile('console.log')
                    } else {
                        logText = "Log file not found in workspace."
                    }
                    // Limit log size to last 2000 characters to avoid message size limits
                    if (logText.length() > 2000) {
                        logText = "... (truncated) ...\n" + logText.substring(logText.length() - 2000)
                    }
                } catch (Exception e) {
                    echo "⚠️  Warning: Could not read log file for chat notification - ${e.getMessage()}"
                    logText = "Error reading log file: ${e.getMessage()}"
                }
                
                if (env.GC_WEBHOOK?.trim()) {
                    try {
                        // Write message to file first to avoid escaping issues
                        writeFile file: 'gc_msg.txt', text: """🔴 *BUILD FAILED*
*Job:* ${env.JOB_NAME}
*Build:* #${env.BUILD_NUMBER}
*Status:* ${currentBuild.currentResult}
🔗 *Build URL:* ${env.BUILD_URL}
*Log:*
${logText}"""
                        
                        // Use jq to properly construct JSON payload and send notification
                        def curlResult = sh(
                            script: """
                                jq -Rs '{text: .}' gc_msg.txt > gc_payload.json
                                curl -X POST -H "Content-Type: application/json" \\
                                     -d @gc_payload.json \\
                                     -w "\\nHTTP Status: %{http_code}\\n" \\
                                     "${env.GC_WEBHOOK}"
                                rm -f gc_msg.txt gc_payload.json
                            """,
                            returnStatus: true
                        )
                        
                        if (curlResult == 0) {
                            echo "✅ Failure notification sent to Google Chat"
                        } else {
                            echo "⚠️  Failed to send failure notification (curl exit code: ${curlResult})"
                        }
                    } catch (Exception e) {
                        echo "⚠️  Error sending failure notification: ${e.getMessage()}"
                    }
                } else {
                    echo "⚠️  GC_WEBHOOK is not configured; skipping failure notification."
                }
            }
        }
    
    always {
            echo 'Cleaning up...'
            script {
                // Clean up any test containers
                sh '''
                    docker stop test-container 2>/dev/null || true
                    docker rm test-container 2>/dev/null || true
                    docker rm temp-container 2>/dev/null || true
                '''
            }
        }
    }
}



// Reusable function to load environment variables from GitLab
def loadGitLabEnv(gitlabProjectId, credentialsId = 'GITLAB_PAT_VJN') {
    echo "🔐 Fetching environment variables from GitLab..."
    
    withCredentials([
        string(credentialsId: credentialsId, variable: 'GITLAB_TOKEN')
    ]) {
        sh """
            # Clear existing file
            > gitlab.env
            
            PAGE=1
            while true; do
                echo "Fetching page \$PAGE..."
                RESPONSE=\$(curl --silent --header "PRIVATE-TOKEN: \$GITLAB_TOKEN" \
                    "https://gitlab.com/api/v4/projects/${gitlabProjectId}/variables?page=\$PAGE&per_page=100")
                
                # Check if we got any variables
                COUNT=\$(echo "\$RESPONSE" | jq '. | length')
                
                if [ -z "\$COUNT" ] || [ "\$COUNT" -eq "0" ]; then
                    echo "No more variables found on page \$PAGE."
                    break
                fi
                
                echo "\$RESPONSE" | jq -r '.[] | (.key + "=" + .value)' >> gitlab.env
                PAGE=\$((PAGE+1))
            done
        """
        
        echo "📄 GitLab variables loaded:"
        sh "cat gitlab.env"
        
        // Count variables loaded
        if (fileExists('gitlab.env')) {
            def envFile = readFile('gitlab.env').trim()
            def lines = envFile.split('\n')
            def varCount = lines.findAll { it.contains('=') }.size()
            echo "✅ Successfully loaded ${varCount} environment variables from GitLab"
            echo "📝 Variables will be passed to Docker container at runtime"
        } else {
            echo "⚠️  gitlab.env file not found"
        }
    }
    
    // Archive the env file
    archiveArtifacts artifacts: 'gitlab.env', allowEmptyArchive: true
}

// Helper function to get a specific environment variable from GitLab env file
def getEnvVarFromGitLab(varName) {
    if (!fileExists('gitlab.env')) {
        return ''
    }
    try {
        def envFile = readFile('gitlab.env').trim()
        def lines = envFile.split('\n')
        for (line in lines) {
            if (line.startsWith("${varName}=")) {
                def value = line.split('=', 2)[1]?.trim()
                if (value) {
                    return value
                }
            }
        }
    } catch (Exception e) {
        echo "⚠️  Error reading ${varName} from gitlab.env: ${e.getMessage()}"
    }
    
    return ''
}

// Helper function to build Docker environment flags (-e KEY=VALUE) from gitlab.env
def getDockerEnvFlags() {
    def envFlags = []
    if (fileExists('gitlab.env')) {
        def envFile = readFile('gitlab.env').trim()
        def lines = envFile.split('\n')
        lines.each { line ->
            if (!line.contains('=') || line.trim().isEmpty()) {
                return
            }
            def parts = line.split('=', 2)
            if (parts.length == 2 && parts[0] && parts[1]) {
                def key = parts[0].trim()
                def value = parts[1].trim()
                
                // Skip registry credentials and very long values
                if (['CI_REGISTRY', 'CI_REGISTRY_USER', 'CI_REGISTRY_PASSWORD'].contains(key)) {
                    return
                }
                if (value.length() > 500 || value.contains('-----')) {
                    return
                }
                
                // Escape single quotes in values
                def escapedValue = value.replace("'", "'\\''")
                envFlags << "-e ${key}='${escapedValue}'"
            }
        }
        echo "✅ Loaded ${envFlags.size()} environment variables from GitLab for container mapping"
    } else {
        echo "⚠️  gitlab.env file not found, no environment variables will be passed to container"
    }
    return envFlags
}
