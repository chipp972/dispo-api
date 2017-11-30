web: node build/server.js
devapi: nodemon --exec "babel-node" --watch src/ ./src/server.js
test: tape-watch -r babel-register "src/**/__tests__/*"
