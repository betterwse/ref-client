# BetterWealth Reference Client

Reference client for interacting with BetterWealth REST API:s.

For external parties there are two main API:s to use when building an integration

## Client API 

The client API is designed with the purpose of letting an end user client communicate directly with the BetterWealth API:s.
All interactions are on behalf of an end user.
The API covers all features a u


For full documentation visit

https://doc.smettermelth.nu/app-api/index.html


## B2B/ServiceToService API

The B2B API is designed to be used by the integration party services in order to access more control over the user flow than when only interacting directly with the client API.

Use cases is for example

* Authentication is handled by the integration party, the B2B API can then be used to gain access to the client API on behalf of a specific user.
* Gathering of KYC documentation is done by the integration party, the B2B API can then be used to create user accounts based on the collected information.

For full documentation visit

https://doc.smettermelth.nu/b2b-api/index.html


### Generate client certificate

Generate a private/public keypair, for example using _openssl_

```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem
```

The public key shall then be sent to BetterWealth, in return a UUID is sent that later shall be used as client id when authentication using the uploaded key.

### Authenticate using the certificate

A signed request must contain the following query parameters:

 * **client_id** - The client id retrieved during setup above
 * **expire** - Expiration of the request as milliseconds. The request is only valid until this timestamp, and it may max be 60s into the future.

The signature is then calculated on the full request url, including all query parameters (in alphabetical order), example:

```
api.smettermelth.nu/test/auth/admin/post?client_id=15270c00-0788-42f9-a113-90f4acdbc80e&expire=1502956146848
```

The calculated signature shall be added to the request in a header named **bw-signature**


## Build and test the demo

1. Build

```
npm install && npm run build
```

2. Demo Authenticate user via B2B API

```
node dist/index.js demo authenticate-user --uuid <ID>
```

3. Demo create user

```
node dist/index.js demo create-user --ssn 1912121212
```