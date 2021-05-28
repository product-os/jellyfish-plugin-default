# This file is auto-synced from product-os/jellyfish-config/sync/Dockerfile
# and should only be edited there!

FROM balena/open-balena-base:v11.2.0

WORKDIR /usr/src/jellyfish
ARG NPM_TOKEN

# Install npm packages
COPY package.json package-lock.json ./
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc && \
	npm ci && rm -f ~/.npmrc

# Copy in source and run lint and unit tests
COPY . ./
RUN npm run test
