import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { IDeleteRequest } from '../lib/interfaces/ILoginService/IDelete.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IDeleteRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IDeleteRequest
    protected response:IResponse


    constructor(incomingRequest:IDeleteRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }



        protected hookConstructorPre() {
          this.requiredInputs = ['cognitoId']
          this.needsToConnectToDatabase = true
        }





    protected performActions() {
      this.deleteLoginProfileByCognitoId()
    }




        private deleteLoginProfileByCognitoId() {
          this.db.delete(this.makeDeleteLoginProfileByCognitoId()).promise()
            .then(result => this.hasSucceeded(result))
            .catch(error => this.hasFailed(error))
        }




            private makeDeleteLoginProfileByCognitoId() {
              return {
                TableName: `_logins-${ process.env.stage }`,
                Key: {
                  saas: process.env.saasName,
                  cognitoId: this.request.cognitoId
                }
              }
            }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
