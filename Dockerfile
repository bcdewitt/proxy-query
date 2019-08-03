# Start with Alpine Linux and Node 12.8.1 installed
FROM node:12.8.1-alpine

# Create the /app folder and set it as the working directory
WORKDIR /app

# Create a non-root user (and set them as the owner of /app)
RUN addgroup -S node-devs && adduser -G node-devs -g "Node Developer" -s /bin/sh -D node-dev \
  && chown node-dev:node-devs /app

# Use the new non-root user for any further RUN, CMD, or ENTRYPOINT instructions
USER node-dev

# Don't need anything else special...just access to sh to run npm and other commands
CMD ["/bin/sh"]
