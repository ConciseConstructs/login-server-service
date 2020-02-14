import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'

export interface IRequest {
  cognitoId:string
}

export function handler(incomingRequest:IRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IRequest
    protected response:IResponse


    constructor(incomingRequest:IRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }



        protected hookConstructorPre() {
          this.requiredInputs = ['cognitoId']
          this.needsToConnectToDatabase = true
        }








    protected performActions() {
      this.queryAccountAndUserByCognitoId()
    }




        private queryAccountAndUserByCognitoId() {
          this.db.query(this.makeGetLoginProfileSyntax()).promise()
            .then(result => this.onQueryAccountAndUserByCognitoIdSuccess(result))
            .catch(error => this.hasFailed(error))
        }




            private makeGetLoginProfileSyntax() {
              return {
                TableName: `_logins-${ process.env.stage }`,
                KeyConditionExpression: 'saas = :saas and cognitoId = :cognitoId',
                ExpressionAttributeValues: {
                  ':saas': process.env.saasName,
                  ':cognitoId': this.request.cognitoId
                }
              }
            }




            private onQueryAccountAndUserByCognitoIdSuccess(result) {
              if (!result.Items) this.hasFailed(result)
              else this.hasSucceeded(result)
            }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
