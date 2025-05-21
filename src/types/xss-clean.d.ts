declare module 'xss-clean' {
  import { RequestHandler } from 'express';
  
  /**
   * Middleware to prevent Cross-Site Scripting (XSS) attacks
   * by sanitizing user input in request body, query string, and params
   */
  function xssClean(): RequestHandler;
  
  export = xssClean;
}