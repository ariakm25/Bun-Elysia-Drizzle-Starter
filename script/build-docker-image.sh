#!/bin/bash

# Build app
docker build . -f ./deployments/app/Dockerfile --tag=elysia-app