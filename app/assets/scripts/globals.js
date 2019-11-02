import {no_image_file, product_image_cache_max_request} from "./constants";
import {fromFile} from "tns-core-modules/image-source";

global._ = require('lodash');
global.moment = require('moment');
global.__ = {};
global.sql = require('sqlstring');
global.DB = require('./services/database').DB;
global.EB = require('./services/EventBus').EventBus;
global.print = require('./services/Printer.js').print;
global.DBCache = require('./services/DBCache').DBCache;
global.CCache = {};
global.ImageCache = new (require("tns-core-modules/ui/image-cache").Cache)();
ImageCache.placeholder = fromFile(no_image_file); ImageCache.maxRequests = product_image_cache_max_request;

