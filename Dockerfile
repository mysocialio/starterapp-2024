#
# Build Production Artifacts
# ==========================================
#
# this first step takes in the source files and build the artifacts
# (basicall all that need to be transpiled).
#
# We do install the NPM dependencies twice so to copy over to the
# production image only what is strictly needed to execute our app.
# 
# NPM Install is the first step so to exploit Docker's cache mechanism
# and speed up the building process. We will re-install from NPM only
# if we touch the `package.json` file. Which doesn't happen so often.
#

FROM node:18.20-alpine AS builder

# NPM Install for building
WORKDIR /usr/src/app-build

RUN corepack enable pnpm && corepack install -g pnpm@latest-9

ADD package.json /usr/src/app-build
ADD pnpm-lock.yaml /usr/src/app-build
RUN pnpm i

# Copy source files:
WORKDIR /usr/src/app-build
ADD .env /usr/src/app-build
ADD babel-preset.js /usr/src/app-build
ADD .eslintrc.js /usr/src/app-build
ADD ssr /usr/src/app-build/ssr
ADD src /usr/src/app-build/src
ADD public /usr/src/app-build/public
ADD index.js /usr/src/app-build

# Build:
WORKDIR /usr/src/app-build
RUN pnpm run build

# Remove dev dependencies
RUN pnpm prune --production




#
# Runner Image
# ==========================================
#
# in this step we start over with a fresh image and copy only what is
# strictly necessary in order to run a production build.
#
# the idea is to keep this image as small as possible.
#

FROM node:18.20-alpine AS runner

# Copy project specific assets:
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app-build/node_modules ./node_modules
COPY --from=builder /usr/src/app-build/node_build ./node_build
ADD package.json /usr/src/app
ADD index.js /usr/src/app
ADD .env /usr/src/app

# Default environment configuration:
EXPOSE 8080
ENV NODE_ENV=production

CMD node index.js
