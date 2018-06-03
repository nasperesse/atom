# Match File
Returns an intelligently sorted array of files.

### Usage

`M([ Directory ], [ Reg Exp for filename ]);`

```javascript
var M = require('match-file-utility');
// Directory
M('dir', /js$/);
// -> [ Array ]
```
