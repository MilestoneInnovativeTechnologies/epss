import {no_image_file, product_image_cache_max_request} from "./constants";
import { ImageSource } from "@nativescript/core";
import { Downloader } from 'nativescript-downloader';

global._ = require('lodash');
global.moment = require('moment');
global.__ = {};
global.sql = require('sqlstring');
global.clickTune = require('nativescript-sound').create('~/assets/sounds/click.mp3');
global.DB = require('./services/database').DB;
global.EB = require('./services/EventBus').EventBus;
global.DBCache = require('./services/DBCache').DBCache;
global.CCache = {};

global.ImageCache = new (require("tns-core-modules/ui/image-cache").Cache)();
ImageCache.placeholder = ImageSource.fromFileSync(no_image_file); ImageCache.maxRequests = product_image_cache_max_request;

Downloader.init(); // Downloader.setTimeout(90);
global.Downloader = new Downloader();

global.Uploader = require('nativescript-background-http');
