'use strict'

require('dotenv').config()
// read tweet timeline
//    username -> array of tweets
// parse tweets
//    array of tweets -> array of mood numbers
// songmaker
//    array of mood numbers -> dope beats
//
const fs = require('fs')

const { SentimentAnalyzer } = require('node-nlp')
const Midi = require('@tonejs/midi')
const fetch = require('node-fetch')
const qs = require('qs')

const sentiment = new SentimentAnalyzer({ language: 'en' })

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

async function main () {
  const res = await fetch(url, {
    headers
  })
  const json = await res.json()
  const texts = json.map(obj => obj.text)
  const sentiments = await Promise.all(texts.map(text => {
    return {
      [text]: sentiment.getSentiment(text)
    }
  }))

  const midiVals = sentiments.map(sentiment => {
    const key = Object.keys(sentiment)[0]
    return Math.floor(((sentiment[key].score * 4) + 63))
  })

  const midi = new Midi()
  const track = midi.addTrack()

  midiVals.forEach((val, idx) => {
    track.addNote({
      midi: val,
      duration: 0.2,
      time: idx * 0.3
    })
  })

  fs.writeFileSync('output.mid', Buffer.from(midi.toArray()))
}

main()
