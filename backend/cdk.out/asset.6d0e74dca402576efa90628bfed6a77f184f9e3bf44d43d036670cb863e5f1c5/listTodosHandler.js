(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lambda/handler/listTodosHandler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lambda/data/listTodos.js":
/*!**********************************!*\
  !*** ./lambda/data/listTodos.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const{ DocumentClient } = __webpack_require__(/*! aws-sdk/clients/dynamodb */ "aws-sdk/clients/dynamodb")
const dynamodb = new DocumentClient()
const{ encode, decode } = __webpack_require__(/*! ./../utils/base64 */ "./lambda/utils/base64.js")

const listTodos = async (todo, options={}) => {
  try{
    const{ limit= 20, nextToken } = options

    let filterObj={
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': todo.key()['PK']
      }
    }

    if(nextToken){
      filterObj.ExclusiveStartKey = decode(nextToken)
    }
    if(limit){
      filterObj.Limit= limit
    }

    const response = await dynamodb.query({
      TableName: process.env['TodosTable'],
      ...filterObj,
    }).promise()

    return{
      todos: response.Items,
      nextToken: encode(response.LastEvaluatedKey)
    }
  } catch(error) {
    console.log(error)
    return{
      error: 'Could not get todos'
    }
  }
}

module.exports = {
  listTodos
}

/***/ }),

/***/ "./lambda/entities/Todo.js":
/*!*********************************!*\
  !*** ./lambda/entities/Todo.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const{ generateId } = __webpack_require__(/*! ./../utils/generateId */ "./lambda/utils/generateId.js")
const{ generateUpdateExpression } = __webpack_require__(/*! ./../utils/generateUpdateExpression */ "./lambda/utils/generateUpdateExpression.js")

class Todo {
  constructor(userId, { id, ...todoData }={}) {
    this.userId = userId
    this.id = id ? id : generateId()

    this.todoData = todoData
  }

  key() {
    return{
      'PK': `Merchant#${this.userId}#Todo`,
      'SK': `Todo#${this.id}`
    }
  }

  // for put
  toItem() {
    return{
      ...this.key(),
      id: this.id,
      userId: this.userId,
      EntityType: 'Todo',
      ...this.todoData
    }
  }

  // for update
  toUpdateItem(){
    if(Object.keys(this.todoData).length === 0)
      throw new Error('Update object should not be empty')

    return generateUpdateExpression(this.todoData)
  }
    
}

module.exports = {
  Todo
}

/***/ }),

/***/ "./lambda/handler/listTodosHandler.js":
/*!********************************************!*\
  !*** ./lambda/handler/listTodosHandler.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const{ listTodos } = __webpack_require__(/*! ../data/listTodos */ "./lambda/data/listTodos.js")
const{ Todo } = __webpack_require__(/*! ../entities/Todo */ "./lambda/entities/Todo.js")
const{ ErrorWrapper } = __webpack_require__(/*! ../utils/errorWrapper */ "./lambda/utils/errorWrapper.js")
const{ responseMapper } = __webpack_require__(/*! ./../utils/responseMapper */ "./lambda/utils/responseMapper.js")

module.exports.handler = async (event, context, callback ) => {
  try{
    console.log(JSON.stringify(event))

    const userId = event.requestContext.authorizer.claims.sub
    
    const listTodosOptions = {}

    const todoInstance = new Todo(userId)

    const{ todos, nextToken, error } = await listTodos(todoInstance, listTodosOptions)
    
    if(error)
      throw new Error(error)

    let response = {
      todos,
      nextToken
    }

    return responseMapper(200, response)
    
  } catch(err){
    console.log(err)
    return callback(ErrorWrapper(err))
  }
}

/***/ }),

/***/ "./lambda/utils/base64.js":
/*!********************************!*\
  !*** ./lambda/utils/base64.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// use case: 
// when you use dynamo query for pagination it would return the last key it queried, imagine this obj at url
// ?pagination={pk: "325", sk:325} WEIRD! 
// so we encode the tokens when returned to the user and decode the tokens we get from the user (just like appsync dynamo)

const encode = (item) => {
  if(!item){
    return null
  }
  return Buffer.from(JSON.stringify(item)).toString('base64')
}

const decode = (item) => {
  return JSON.parse(Buffer.from(item, 'base64').toString())
}

module.exports = {
  encode,
  decode
}

/***/ }),

/***/ "./lambda/utils/errorWrapper.js":
/*!**************************************!*\
  !*** ./lambda/utils/errorWrapper.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const{ errors } = __webpack_require__(/*! ./errors */ "./lambda/utils/errors.js")
const{ responseMapper } = __webpack_require__(/*! ./responseMapper */ "./lambda/utils/responseMapper.js")

const ErrorWrapper = (errorKey) => {
  try{
    let error = errors[errorKey.message]

    if(!error){
      // in case errorKey isn't correct
      throw new Error('Bad Key')
    }
    return errorResponseMapper(error)

  } catch(e){
    console.log('BAD Key', errorKey, 'error', e)
    // default error
    return errorResponseMapper(errors['GeneralError'])
  }
}

const errorResponseMapper = (error) =>{
  return responseMapper(error.statusCode, error)
}

module.exports = {
  ErrorWrapper,
}


/***/ }),

/***/ "./lambda/utils/errors.js":
/*!********************************!*\
  !*** ./lambda/utils/errors.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// errorKey => can be used as keys on i18n (on client side)
// message => for information only

const errors = {
  GeneralError: {
    message: 'Something went wrong! (contact backend)',
    errorKey: 'GeneralError',
    statusCode: 500
  },
  TodoGeneralError: {
    message: 'Todo: Something went wrong!',
    errorKey: 'TodoGeneralError',
    statusCode: 500
  },
}

module.exports = { errors }


/***/ }),

/***/ "./lambda/utils/generateId.js":
/*!************************************!*\
  !*** ./lambda/utils/generateId.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const crypto = __webpack_require__(/*! crypto */ "crypto")
const KSUID = __webpack_require__(/*! ksuid */ "./node_modules/ksuid/index.js")

const generateId = (date = new Date()) => {
  const payload = crypto.randomBytes(16)
  return KSUID.fromParts(date.getTime(), payload).string
}

module.exports = {
  generateId
}

/***/ }),

/***/ "./lambda/utils/generateUpdateExpression.js":
/*!**************************************************!*\
  !*** ./lambda/utils/generateUpdateExpression.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// takes updatePayload like {
//   name: "test"
// } and converts it to dynamo expression
// on db.update({  pass ...generateUpdateExpression

// remove payload contains keys you want to delete like ["gsi1pk", "gsi1sk"]
const generateUpdateExpression = (updatePayload, removePayload = []) => {
  let UpdateExpression = 'SET '
  let ExpressionAttributeValues = {}
  let ExpressionAttributeNames = {}

  const keys = Object.keys(updatePayload)
  for(const key of keys) {
    UpdateExpression += `#${key}=:${key},`
    ExpressionAttributeValues[`:${key}`] = updatePayload[key]
    ExpressionAttributeNames[`#${key}`] = key
  }
  
  UpdateExpression=UpdateExpression.slice(0, -1)

  if(removePayload.length!==0){
    UpdateExpression += ' REMOVE '
    removePayload.map(removeKey=> UpdateExpression += `${removeKey},`)
    UpdateExpression=UpdateExpression.slice(0, -1)
  }

  console.log(UpdateExpression)
  return{
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}

module.exports = {
  generateUpdateExpression
}

/***/ }),

/***/ "./lambda/utils/responseMapper.js":
/*!****************************************!*\
  !*** ./lambda/utils/responseMapper.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

const responseMapper = (status, error) =>{
  return{
    statusCode: status, 
    body: JSON.stringify(error),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  }
}

module.exports = {
  responseMapper,
}


/***/ }),

/***/ "./node_modules/base-convert-int-array/index.js":
/*!******************************************************!*\
  !*** ./node_modules/base-convert-int-array/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const maxLength = (array, from, to) => Math.ceil(array.length * Math.log2(from) / Math.log2(to))

function baseConvertIntArray (array, {from, to, fixedLength = null}) {
  const length = fixedLength === null ? maxLength(array, from, to) : fixedLength
  const result = new Array(length)

  // Each iteration prepends the resulting value, so start the offset at the end.
  let offset = length
  let input = array
  while (input.length > 0) {
    if (offset === 0) {
      throw new RangeError(`Fixed length of ${fixedLength} is too small, expected at least ${maxLength(array, from, to)}`)
    }

    const quotients = []
    let remainder = 0

    for (const digit of input) {
      const acc = digit + remainder * from
      const q = Math.floor(acc / to)
      remainder = acc % to

      if (quotients.length > 0 || q > 0) {
        quotients.push(q)
      }
    }

    result[--offset] = remainder
    input = quotients
  }

  // Trim leading padding, unless length is fixed.
  if (fixedLength === null) {
    return offset > 0 ? result.slice(offset) : result
  }

  // Fill in any holes in the result array.
  while (offset > 0) {
    result[--offset] = 0
  }
  return result
}
module.exports = baseConvertIntArray


/***/ }),

/***/ "./node_modules/ksuid/base62.js":
/*!**************************************!*\
  !*** ./node_modules/ksuid/base62.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const baseConvertIntArray = __webpack_require__(/*! base-convert-int-array */ "./node_modules/base-convert-int-array/index.js")

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function encode (buffer, fixedLength) {
  return baseConvertIntArray(buffer, { from: 256, to: 62, fixedLength })
    .map(value => CHARS[value])
    .join('')
}
exports.encode = encode

function decode (string, fixedLength) {
  // Optimization from https://github.com/andrew/base62.js/pull/31.
  const input = Array.from(string, char => {
    const charCode = char.charCodeAt(0)
    if (charCode < 58) return charCode - 48
    if (charCode < 91) return charCode - 55
    return charCode - 61
  })
  return Buffer.from(baseConvertIntArray(input, { from: 62, to: 256, fixedLength }))
}
exports.decode = decode


/***/ }),

/***/ "./node_modules/ksuid/index.js":
/*!*************************************!*\
  !*** ./node_modules/ksuid/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const { randomBytes } = __webpack_require__(/*! crypto */ "crypto")
const { inspect: { custom: customInspectSymbol }, promisify } = __webpack_require__(/*! util */ "util")
const base62 = __webpack_require__(/*! ./base62 */ "./node_modules/ksuid/base62.js")

const asyncRandomBytes = promisify(randomBytes)

// KSUID's epoch starts more recently so that the 32-bit number space gives a
// significantly higher useful lifetime of around 136 years from March 2014.
// This number (14e11) was picked to be easy to remember.
const EPOCH_IN_MS = 14e11

const MAX_TIME_IN_MS = 1e3 * (2 ** 32 - 1) + EPOCH_IN_MS

// Timestamp is a uint32
const TIMESTAMP_BYTE_LENGTH = 4

// Payload is 16-bytes
const PAYLOAD_BYTE_LENGTH = 16

// KSUIDs are 20 bytes when binary encoded
const BYTE_LENGTH = TIMESTAMP_BYTE_LENGTH + PAYLOAD_BYTE_LENGTH

// The length of a KSUID when string (base62) encoded
const STRING_ENCODED_LENGTH = 27

const TIME_IN_MS_ASSERTION = `Valid KSUID timestamps must be in milliseconds since ${new Date(0).toISOString()},
  no earlier than ${new Date(EPOCH_IN_MS).toISOString()} and no later than ${new Date(MAX_TIME_IN_MS).toISOString()}
`.trim().replace(/(\n|\s)+/g, ' ').replace(/\.000Z/g, 'Z')

const VALID_ENCODING_ASSERTION = `Valid encoded KSUIDs are ${STRING_ENCODED_LENGTH} characters`

const VALID_BUFFER_ASSERTION = `Valid KSUID buffers are ${BYTE_LENGTH} bytes`

const VALID_PAYLOAD_ASSERTION = `Valid KSUID payloads are ${PAYLOAD_BYTE_LENGTH} bytes`

function fromParts (timeInMs, payload) {
  const timestamp = Math.floor((timeInMs - EPOCH_IN_MS) / 1e3)
  const timestampBuffer = Buffer.allocUnsafe(TIMESTAMP_BYTE_LENGTH)
  timestampBuffer.writeUInt32BE(timestamp, 0)

  return Buffer.concat([timestampBuffer, payload], BYTE_LENGTH)
}

const bufferLookup = new WeakMap()

class KSUID {
  constructor (buffer) {
    if (!KSUID.isValid(buffer)) {
      throw new TypeError(VALID_BUFFER_ASSERTION)
    }

    bufferLookup.set(this, buffer)
    Object.defineProperty(this, 'buffer', {
      enumerable: true,
      get () { return Buffer.from(buffer) }
    })
  }

  get raw () {
    return Buffer.from(bufferLookup.get(this).slice(0))
  }

  get date () {
    return new Date(1e3 * this.timestamp + EPOCH_IN_MS)
  }

  get timestamp () {
    return bufferLookup.get(this).readUInt32BE(0)
  }

  get payload () {
    const payload = bufferLookup.get(this).slice(TIMESTAMP_BYTE_LENGTH, BYTE_LENGTH)
    return Buffer.from(payload)
  }

  get string () {
    const encoded = base62.encode(bufferLookup.get(this), STRING_ENCODED_LENGTH)
    return encoded.padStart(STRING_ENCODED_LENGTH, '0')
  }

  compare (other) {
    if (!bufferLookup.has(other)) {
      return 0
    }

    return bufferLookup.get(this).compare(bufferLookup.get(other), 0, BYTE_LENGTH)
  }

  equals (other) {
    return this === other || (bufferLookup.has(other) && this.compare(other) === 0)
  }

  toString () {
    return `${this[Symbol.toStringTag]} { ${this.string} }`
  }

  [customInspectSymbol] () {
    return this.toString()
  }

  static async random (time = Date.now()) {
    const payload = await asyncRandomBytes(PAYLOAD_BYTE_LENGTH)
    return new KSUID(fromParts(Number(time), payload))
  }

  static randomSync (time = Date.now()) {
    const payload = randomBytes(PAYLOAD_BYTE_LENGTH)
    return new KSUID(fromParts(Number(time), payload))
  }

  static fromParts (timeInMs, payload) {
    if (!Number.isInteger(timeInMs) || timeInMs < EPOCH_IN_MS || timeInMs > MAX_TIME_IN_MS) {
      throw new TypeError(TIME_IN_MS_ASSERTION)
    }
    if (!Buffer.isBuffer(payload) || payload.byteLength !== PAYLOAD_BYTE_LENGTH) {
      throw new TypeError(VALID_PAYLOAD_ASSERTION)
    }

    return new KSUID(fromParts(timeInMs, payload))
  }

  static isValid (buffer) {
    return Buffer.isBuffer(buffer) && buffer.byteLength === BYTE_LENGTH
  }

  static parse (string) {
    if (string.length !== STRING_ENCODED_LENGTH) {
      throw new TypeError(VALID_ENCODING_ASSERTION)
    }

    const decoded = base62.decode(string, BYTE_LENGTH)
    if (decoded.byteLength === BYTE_LENGTH) {
      return new KSUID(decoded)
    }

    const buffer = Buffer.allocUnsafe(BYTE_LENGTH)
    const padEnd = BYTE_LENGTH - decoded.byteLength
    buffer.fill(0, 0, padEnd)
    decoded.copy(buffer, padEnd)
    return new KSUID(buffer)
  }
}
Object.defineProperty(KSUID.prototype, Symbol.toStringTag, { value: 'KSUID' })
// A string-encoded maximum value for a KSUID
Object.defineProperty(KSUID, 'MAX_STRING_ENCODED', { value: 'aWgEPTl1tmebfsQzFP4bxwgy80V' })
// A string-encoded minimum value for a KSUID
Object.defineProperty(KSUID, 'MIN_STRING_ENCODED', { value: '000000000000000000000000000' })

module.exports = KSUID


/***/ }),

/***/ "aws-sdk/clients/dynamodb":
/*!*******************************************!*\
  !*** external "aws-sdk/clients/dynamodb" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("aws-sdk/clients/dynamodb");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ })));
//# sourceMappingURL=listTodosHandler.js.map