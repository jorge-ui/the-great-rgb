const path = require('path')


module.exports = {
   mode: 'production',
   module: {
      rules: [
         {
            test: /.mp3$/,
            loader: 'file-loader',
            options: {
               outputPath: 'sounds'
            }
         }
      ]
   }
}