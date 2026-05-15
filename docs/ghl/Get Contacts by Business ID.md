Version: 2023-02-21
Get Contacts By BusinessId
GET
https://services.leadconnectorhq.com/contacts/business/:businessId
Get Contacts By BusinessId

Requirements
Scope(s)
contacts.readonly
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

Example: 2021-07-28
Path Parameters
businessId
string
required
Business Id

Example: 641c094001436dbc2081e642
Query Parameters
limit
string
Maximum number of records per page (up to 100, default 25)

Example: 10
locationId
string
required
Location Id

Example: 5DP4iH6HLkQsiKESj6rh
skip
string
Number of records to skip

Example: 10
query
string
Search query (name, email, phone)

Example: contact name
startAfter
string[]
Cursor for pagination (comma-separated name,id pair)

Example: eleanor sakai,xurJiljRhcxpwRYXbxUU
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
contacts
object[]
List of contacts associated with the business

Array [
id
string
Unique identifier of the contact

Example:ocQHyuzHvysMo5N5VsXc
locationId
string
Location Id the contact belongs to

Example:C2QujeCh8ZnC7al2InWR
email
string
Email address of the contact

Example:JohnDeo@gmail.com
timezone
string
Timezone of the contact

Example:Asia/Calcutta
country
string
Country of the contact

Example:DE
source
string
Source from which the contact was created

Example:xyz form
dateAdded
string
Date and time the contact was added (ISO 8601)

Example:2020-10-29T09:31:30.255Z
customFields
object[]
tags
string[]
List of tags associated with the contact

Example:["nisi sint commodo amet","consequat"]
businessId
string
Business Id the contact is associated with

Example:641c094001436dbc2081e642
attributions
object[]
followers
string[]
List of user Ids following this contact

Example:["641c094001436dbc2081e642"]
]
count
number
Total number of contacts matching the query

Example:10
