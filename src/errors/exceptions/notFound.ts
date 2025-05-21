export class NotFoundException extends Error {
  status: number
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundException'
    this.status = 404
  }}
