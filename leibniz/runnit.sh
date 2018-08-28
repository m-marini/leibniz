#!/bin/bash
docker stop dev

docker run \
    --rm \
    --name dev \
    --volume $(pwd):/usr/share/nginx/html:ro \
    --detach \
    --publish 8080:80 \
    nginx:1.13.9-alpine
