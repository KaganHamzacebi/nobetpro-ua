#!/bin/bash
 
if [[ $VERCEL_ENV == "production"  ]] ; then
  pnpm run build
else
  pnpm run build
fi
