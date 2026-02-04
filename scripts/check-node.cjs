#!/usr/bin/env node
const semver = require('semver')
const version = process.version
if (!semver.satisfies(version, '>=22.12.0')) {
  console.error(`Node version ${version} is not supported. Please use Node >=22.12.0`)
  process.exit(1)
}
