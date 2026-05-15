Version: 2023-02-21
Get Pipelines
GET
https://services.leadconnectorhq.com/opportunities/pipelines
Get Pipelines

Requirements
Scope(s)
opportunities.readonly
Auth Method(s)
OAuth Access Token
Private Integration Token
Token Type(s)
Sub-Account Token
Request
Header Parameters
Version
string
required
Possible values: [2023-02-21]

API Version

Query Parameters
locationId
string
required
Example: ve9EPM428h8vShlRW1KT
Responses
200
400
401
Successful response
application/json
Schema
Example (auto)
Schema
pipelines
object[]
Array [
id
string
Example:aWdODOBVOlH1RUFKWQke
name
string
Example:new pipeline
stages
array[]
showInFunnel
boolean
Example:false
showInPieChart
boolean
Example:true
locationId
string
Example:dsjddjkndadqaja
]
