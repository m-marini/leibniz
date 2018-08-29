def scm = ""
pipeline {
    agent {
        docker { image 'node:7-alpine' }
    }

    stages {
        stage('Prepare') {
            steps {
                echo 'Preparing...'
                script {
                    scm = checkout([$class: 'GitSCM', branches: [[name: 'refs/heads/issue-1']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '38930d0a-7c16-403b-b5b1-a506508dd48a', url: 'https://github.com/m-marini/leibnitz.git']]])
                }
                echo "scm=${scm}"
                echo "GIT_BRANCH=${scm.GIT_BRANCH}"
                echo "GIT_URL=${scm.GIT_URL}"
                echo "GIT_COMMIT=${scm.GIT_COMMIT}"
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                dir("leibniz") {
                    sh 'pwd'
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'ls -al'
                    ftpPublisher masterNodeName: '', paramPublish:[parameterName: ''], alwaysPublishFromMaster: false, continueOnError: false, failOnError: false, publishers: [[configName: 'register.it', transfers: [[asciiMode: false, cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/leibniz', remoteDirectorySDF: false, removePrefix: 'dist', sourceFiles: 'dist/**']], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true]]
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'deploy...'
                dir("leibniz") {
                    sh 'ls -al'
                }
            }
        }
    }
}
