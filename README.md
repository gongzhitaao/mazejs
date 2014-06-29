Maze generator and solver
-------------------------

A simple maze generator and solver implemented in JavaScript.

### How to use generators###

1. Create a generator

   ```javascript
   var g = maze.generator.dfs();
   ```

2. Step by step, create the maze.

   ```javascript
   var ret;
   while (!g.end())
       ret = g.next()
   ```

   `ret` is an object:

   ```javascript
   ret = {
       forward: true,
       current: [row, col], // current position
       next: [row, col],    // next position
   }
   ```

   The `forward` field indicates whether this step is a forward
   searching or backward retrieving.

3. Get the maze.

   ```javascript
   var m = g.maze();
   ```

   Maze patterns are stored as 2D array.  Each cell contains an array
   of 4, indicating whether *top*, *right*, *down* and *left* is
   connected or not.
