import { ValueTransformer } from 'typeorm'

export class DateTransformer implements ValueTransformer {
  private generated: boolean

  constructor(options?: { generated: boolean }) {
    this.generated = options?.generated ?? false
  }

  to(value) {
    if (this.generated) return undefined
    return new Date(value)
  }

  from(value) {
    return new Date(value).getTime()
  }
}
