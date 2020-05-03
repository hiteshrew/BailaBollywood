const cacheMiddleware={}
const mcache = require('memory-cache');
const flatCache = require("flat-cache");
const Memcached = require("memcached");
let memCache = new mcache.Cache();
let path = require('path');

cacheMiddleware.memoryCacheUse = duration => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cacheContent = memCache.get(key);
    if (cacheContent) {
      res.send(cacheContent);
      console.log('reading from cache');
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        memCache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      console.log('storing in cache');
      next();
    }
  };
};


// --------------------------------------------------------
// Configuring Flat Cache Middleware for File Caching
// --------------------------------------------------------

let cache = flatCache.load("productsCache", path.resolve("./cache"));

cacheMiddleware.flatCacheMiddleware = (req, res, next) => {
  let key = "__express__" + req.originalUrl || req.url;
  let cacheContent = cache.getKey(key);
  console.log(cacheContent);
  if (cacheContent) {
    res.send(cacheContent);
    return;
  } else {
    res.sendResponse = res.send;
    res.send = body => {
      cache.setKey(key, body);
      cache.save();
      res.sendResponse(body);
    };
    next();
  }
};

// --------------------------------------------------------
// Using the MemCached Service for File Caching
// --------------------------------------------------------
let memcached = new Memcached("127.0.0.1:11211");

cacheMiddleware.memcachedMiddleware = duration => {
  return (req, res, next) => {
    let key = "__expreeedddddss__" + req.originalUrl || req.url;
    memcached.get(key, function(err, data) {
      if (data) {
        res.send(data);
        return;
      } else {
        res.sendResponse = res.send;
        res.send = body => {
          memcached.set(key, body, duration * 60, function(err) {
            //
          });
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};





module.exports = cacheMiddleware;