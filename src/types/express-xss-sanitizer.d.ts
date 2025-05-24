declare module 'express-xss-sanitizer' {
  import { RequestHandler } from 'express';
  
  /**
   * Middleware to prevent Cross-Site Scripting (XSS) attacks
   * by sanitizing user input in request body, query string, and params
   */
  function expressXssSanitizer(): RequestHandler;
  
  export = expressXssSanitizer;
}