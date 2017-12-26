# about this
## abstract
This repository is for front of QaApp.This is written by vue.js and onsenui(design) and deploy to heroku.

## main content
 - manage : use `vuex` for state manage and `cookie-in-vue` for set authentication token

# Prepare

## Install

 - vue.js and onsenui(refer to フロント実行 in wiki)
 - other libraries in package.json
  └please do `npm install` in this repository

## heroku deploy

please refer to https://github.com/akinoriosamura/QaAppServer/issues/21#issuecomment-348400768

## key

set variable in env

 - stripe(in stripe web site)
  └STRIPE_PUBLISH

# start
## develop
 - `monaca preview`

## test or production
 - `monaca transpile`
 - `cd www`
 - git push to heroku