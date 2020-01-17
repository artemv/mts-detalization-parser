#!/bin/bash

set +e
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
if [ "${NVM_DIR}" == "" ]; then
  export NVM_DIR="$HOME/.nvm"
fi
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if [ "${NODE_VERSION}" == "" ]; then
  NODE_VERSION="8.10.0"
fi
nvm install v${NODE_VERSION}
nvm alias default v${NODE_VERSION}

# Each step uses the same `$BASH_ENV`, so need to modify it
echo export NVM_DIR="$NVM_DIR" >> $BASH_ENV
echo "[ -s \"$NVM_DIR/nvm.sh\" ] && . \"$NVM_DIR/nvm.sh\"" >> $BASH_ENV

node --version
