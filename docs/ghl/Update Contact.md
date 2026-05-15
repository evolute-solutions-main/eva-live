Update Contact
PUT
https://services.leadconnectorhq.com/contacts/:contactId
Please find the list of acceptable values for the country field here

Requirements
Scope(s)
contacts.write
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
contactId
string
required
Contact Id

Example: ocQHyuzHvysMo5N5VsXc
application/json
Bodyrequired
firstName
string
nullable
First name of the contact

Example:rosan
lastName
string
nullable
Last name of the contact

Example:Deo
name
string
nullable
Full name of the contact

Example:rosan Deo
email
string
nullable
Email address of the contact

Example:rosan@deos.com
phone
string
nullable
Phone number of the contact

Example:+1 888-888-8888
address1
string
nullable
Street address of the contact

Example:3535 1st St N
city
string
nullable
City of the contact

Example:Dolomite
state
string
nullable
State of the contact

Example:AL
postalCode
string
Postal code of the contact

Example:35061
website
string
nullable
Website URL of the contact

Example:https://www.tesla.com
timezone
string
nullable
Timezone of the contact

Example:America/Chihuahua
dnd
boolean
Whether Do Not Disturb is enabled for the contact

Example:true
dndSettings
object
inboundDndSettings
object
tags
string[]
This field will overwrite all current tags associated with the contact. To update a tags, it is recommended to use the Add Tag or Remove Tag API instead.

Example:["nisi sint commodo amet","consequat"]
customFields
object[]
source
string
nullable
Source from which the contact was updated

Example:public api
dateOfBirth
object
nullable
The birth date of the contact. Supported formats: YYYY/MM/DD, MM/DD/YYYY, YYYY-MM-DD, MM-DD-YYYY, YYYY.MM.DD, MM.DD.YYYY, YYYY_MM_DD, MM_DD_YYYY

Example:1990-09-25
country
string
Country code of the contact (ISO 3166-1 alpha-2)

Example:US
assignedTo
string
nullable
User's Id

Example:y0BeYjuRIlDwsDcOHOJo
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
succeded
boolean
Whether the update operation succeeded

Example:true
contact
object
The updated contact details

id
string
Unique identifier of the contact

Example:seD4PfOuKoVMLkEZqohJ
name
string
Full name of the contact

Example:rubika deo
locationId
string
Location Id the contact belongs to

Example:ve9EPM428h8vShlRW1KT
firstName
string
First name of the contact

Example:rubika
lastName
string
Last name of the contact

Example:Deo
email
string
Email address of the contact

Example:rubika@deos.com
emailLowerCase
string
Lowercase version of the contact email

Example:rubika@deos.com
timezone
string
Timezone of the contact

Example:Asia/Calcutta
companyName
string
Company name of the contact

Example:DGS VolMAX
phone
string
Phone number of the contact

Example:+18832327657
dnd
boolean
Whether Do Not Disturb is enabled for the contact

Example:true
dndSettings
object
type
string
Contact type classification

Example:lead
source
string
Source from which the contact was created

Example:public api
assignedTo
string
User Id the contact is assigned to

Example:ve9EPM428h8vShlRW1KT
address1
string
Street address of the contact

Example:3535 1st St N
city
string
City of the contact

Example:Birmingham
state
string
State of the contact

Example:AL
country
string
Country of the contact

Example:US
postalCode
string
Postal code of the contact

Example:35061
website
string
Website URL of the contact

Example:https://www.tesla.com
tags
string[]
List of tags associated with the contact

Example:["nisi sint commodo amet","consequat"]
dateOfBirth
string
Date of birth of the contact (YYYY-MM-DD)

Example:1990-09-25
dateAdded
string
Date and time the contact was added (ISO 8601)

Example:2021-07-02T05:18:26.704Z
dateUpdated
string
Date and time the contact was last updated (ISO 8601)

Example:2021-07-02T05:18:26.704Z
attachments
string
List of attachment URLs associated with the contact

Example:[]
ssn
string
Social Security Number (if applicable)

Example:123-45-6789
keyword
string
Search keyword associated with the contact

Example:test
firstNameLowerCase
string
Lowercase version of the contact first name

Example:rubika
fullNameLowerCase
string
Lowercase version of the contact full name

Example:rubika deo
lastNameLowerCase
string
Lowercase version of the contact last name

Example:deo
lastActivity
string
Date and time of last activity on this contact (ISO 8601)

Example:2021-07-16T11:39:30.564Z
customFields
object[]
businessId
string
Business Id the contact is associated with

Example:641c094001436dbc2081e642
attributionSource
object
lastAttributionSource
object
visitorId
string
visitorId is the Unique ID assigned to each Live chat visitor.

Example:ve9EPM428h8vShlRW1KT