FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package.json mission.js server.js ./
COPY --chown=node:node public ./public
RUN mkdir -p /app/data && chown node:node /app/data
# Railway mounts the optional volume at runtime. Drop privileges after preparing its directory.
COPY start-container.sh /usr/local/bin/start-crisis
RUN chmod 755 /usr/local/bin/start-crisis && apk add --no-cache su-exec
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/start-crisis"]
