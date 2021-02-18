#!/bin/sh

mv .yarnrc.yml .yarnrc.yml.bak
touch .yarnrc.yml
yarn set version berry
mv .yarnrc.yml.bak .yarnrc.yml
