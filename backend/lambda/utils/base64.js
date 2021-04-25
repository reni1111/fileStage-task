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