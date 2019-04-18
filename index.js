'use strict'

require('dotenv').config()
// read tweet timeline
//    username -> array of tweets
// parse tweets
//    array of tweets -> array of mood numbers
// songmaker
//    array of mood numbers -> dope beats
//
const fetch = require('node-fetch')
const qs = require('qs')

const username = process.argv[2]
const baseUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json'
const count = 3200
const trimUser = true
const includeRts = false
const excludeReplies = true
const headers = {
  authorization: `Bearer ${process.env.BEARER_TOKEN}`
}

const params = {
  count,
  trim_user: trimUser,
  screen_name: username,
  include_rts: includeRts,
  exclude_replies: excludeReplies
}

const url = `${baseUrl}?${qs.stringify(params)}`
fetch(url, {
  headers
}).then(res => res.json())
  .then(json => {
    return json.map(obj => obj.text)
  })
  .then(texts => {
    console.log(texts)
  })
