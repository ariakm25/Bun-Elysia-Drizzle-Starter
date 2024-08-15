#!/bin/bash

# Build app
podman build -f ./deployments/app/Dockerfile . --tag=elysia-app