import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { catchError, Observable, tap } from 'rxjs'
import { LoggerService } from '../logger/logger.service'

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(TracingInterceptor.name)
  }

  printError(err: any) {
    const result = ['Exception occurred:']

    while (err.cause) {
      result.push(String(err))
      err = err.cause
    }

    result.push(err.stack)
    this.logger.error(result.join('\n'))
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctlName = context.getClass().name
    const hdlName = context.getHandler().name

    const req = context.switchToHttp().getRequest()
    const msg = `route: ${req.url}, handler: ${ctlName}#${hdlName}`

    this.logger.log(`${msg}, phase: start`)

    const now = Date.now()
    return next.handle().pipe(
      tap(() =>
        this.logger.log(`${msg}, phase: end, last: ${Date.now() - now}ms`)
      ),
      catchError((err) => {
        this.printError(err)
        this.logger.error(
          `${msg}, phase: error occurred, last: ${Date.now() - now}ms`
        )
        throw err
      })
    )
  }
}
