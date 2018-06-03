var js = [
  'src/matchFile.js',
];

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    uglify : {
      options : {
        banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap : false,
        mangle : true
      },
      main : { files: { 'matchFile.min.js': js, } }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
};
