import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { ICreateRequest } from '../lib/interfaces/ILoginService/ICreate.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'



export function handler(incomingRequest:ICreateRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:ICreateRequest
    protected response:IResponse
    protected db:DynamoDB.DocumentClient


    constructor(incomingRequest:ICreateRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }



        protected hookConstructorPre() {
          this.requiredInputs = ['authId', 'acctId', 'userId']
          this.needsToConnectToDatabase = true
        }








    protected performActions() {
      this.createLoginProfile()
    }




        private createLoginProfile() {
          this.db.put(this.makeProfileSyntax()).promise()
            .then(result => this.hasSucceeded(result))
            .catch(error => this.hasFailed(error))
        }




            private makeProfileSyntax() {
              return {
                TableName: `_logins-${ process.env.stage }`,
                Item: {
                  saas: this.request.saasName,
                  cognitoId: this.request.authId,
                  acctId:  this.request.acctId,
                  userId: this.request.userId,
                }
              }
            }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
