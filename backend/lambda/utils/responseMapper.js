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
