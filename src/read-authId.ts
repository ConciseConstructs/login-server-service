import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { IReadAuthIdRequest } from '../lib/interfaces/ILoginService/IReadAuthId.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadAuthIdRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IReadAuthIdRequest
    protected response:IResponse


    constructor(incomingRequest:IReadAuthIdRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }



        protected hookConstructorPre() {
          this.requiredInputs = ['authId']
          this.needsToConnectToDatabase = true
        }








    protected performActions() {
      this.queryAccountAndUserByAuthId()
    }




        private queryAccountAndUserByAuthId() {
          this.db.query(this.makeGetLoginProfileSyntax()).promise()
            .then(result => this.onQueryAccountAndUserByAuthIdSuccess(result))
            .catch(error => this.hasFailed(error))
        }




            private makeGetLoginProfileSyntax() {
              return {
                TableName: `_logins-${ process.env.stage }`,
                KeyConditionExpression: 'saas = :saas and cognitoId = :authId',
                ExpressionAttributeValues: {
                  ':saas': this.request.saasName,
                  ':authId': this.request.authId
                }
              }
            }




            private onQueryAccountAndUserByAuthIdSuccess(result) {
              if (!result.Items) this.hasFailed(result)
              else this.hasSucceeded(result)
            }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
