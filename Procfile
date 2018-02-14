web: node build/index.js
devapi: nodemon --exec "babel-node" --watch src/ ./src/index.js
test: tape-watch --require babel-register "src/**/__tests__/*" --clear --pipe tap-spec
