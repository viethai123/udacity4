import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { generateAttachmentUrl, updateAttachmentUrl } from '../../businessLogic'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    
    const generateAttachmentId = uuid.v4()

    const url = await generateAttachmentUrl(generateAttachmentId)
    await updateAttachmentUrl(userId, todoId, generateAttachmentId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        url
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
