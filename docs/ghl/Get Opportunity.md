Version: 2023-02-21
Get Opportunity
GET
https://services.leadconnectorhq.com/opportunities/:id
Get Opportunity

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

Path Parameters
id
string
required
Opportunity Id

Example: yWQobCRIhRguQtD2llvk
Responses
200
400
401
422
Successful response
application/json
Schema
Example (auto)
Schema
opportunity
object
id
string
Example:yWQobCRIhRguQtD2llvk
name
string
Example:testing
monetaryValue
number
Example:500
pipelineId
string
Example:VDm7RPYC2GLUvdpKmBfC
pipelineStageId
string
Example:e93ba61a-53b3-45e7-985a-c7732dbcdb69
assignedTo
string
Example:zT46WSCPbudrq4zhWMk6
status
string
Example:open
source
string
Example:
lastStatusChangeAt
string
Example:2021-08-03T04:55:17.355Z
lastStageChangeAt
string
Example:2021-08-03T04:55:17.355Z
lastActionDate
string
Example:2021-08-03T04:55:17.355Z
indexVersion
string
Example:1
createdAt
string
Example:2021-08-03T04:55:17.355Z
updatedAt
string
Example:2021-08-03T04:55:17.355Z
contactId
string
Example:zT46WSCPbudrq4zhWMk6
locationId
string
Example:zT46WSCPbudrq4zhW
contact
object
notes
array[]
tasks
array[]
calendarEvents
array[]
lostReasonId
string
Example:zT46WSCPbudrq4zhWMk6
customFields
object[]
followers
array[]