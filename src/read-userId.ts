import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { IReadUserIdRequest } from '../lib/interfaces/ILoginService/IReadUserId.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadUserIdRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IReadUserIdRequest
    protected response:IResponse


    constructor(incomingRequest:IReadUserIdRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }



        protected hookConstructorPre() {
          this.requiredInputs = ['userId']
          this.needsToConnectToDatabase = true
        }




    protected performActions() {
      this.db.query(this.makeAllSyntax()).promise()
        .then(result => this.hasSucceeded(result))
        .catch(error => this.hasFailed(error))
    }




        private makeAllSyntax() {
          return {
            TableName: `_logins-${ process.env.stage }`,
            IndexName: 'userId',
            KeyConditionExpression: '#saas = :saas and #userId = :userId',
            ExpressionAttributeNames: {
              "#userId": 'userId',
              "#saas": 'saas'
            },
            ExpressionAttributeValues: {
              ':userId': this.request.userId,
              ':saas': `${ process.env.saasName }`
            }
          }
        }

  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
