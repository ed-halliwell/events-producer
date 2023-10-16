import type { Request, Response } from "express";

export const getHome = async (_: Request, res: Response) => {
  return res.send(`
    <!DOCTYPE html>
    <html>
       <head>
          <title>Event Testing</title>
       </head>
       <body>
          <h1>Event Testing!</h1>
          <form action="/" method="post" id="form1">
             <label for="message">Message:</label>
             <input type="text" id="message" name="message">
             <input type="submit" value="OK" />
          </form>
       </body>
    </html>
  `);
};
