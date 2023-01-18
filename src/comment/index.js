/*
  - This index js file is where we expose our comment entity.
  - This is where we bring in all of our 3rd party or internal dependencies or libraries.
  - This file is responsible for building our makeComment function.
  - It exports a valid makeComment function that has all the dependencies injected.
  
  - Because of this,
    - In future if we want to change to different crypto library or sanitize-html library,
    - we can do so without having to interfere with the business logic of our comment entity.
*/

import crypto from 'crypto'
import Id from '../Id'
import ipRegex from 'ip-regex'
import sanitizeHtml from 'sanitize-html'
import buildMakeComment from './comment'
import buildMakeSource from './source'

const makeSource = buildMakeSource({ isValidIp })
const makeComment = buildMakeComment({ Id, md5, sanitize, makeSource })

export default makeComment

function isValidIp (ip) {
  return ipRegex({ exact: true }).test(ip)
}

function md5 (text) {
  return crypto
    .createHash('md5')
    .update(text, 'utf-8')
    .digest('hex')
}

// we bring in sanitize-html library and write our own little santize function that does some configuration fn on behalf of our comment entity.
function sanitize (text) {
  // TODO: allow more coding embeds
  return sanitizeHtml(text, {
    allowedIframeHostnames: ['codesandbox.io', 'repl.it']
  })
}
