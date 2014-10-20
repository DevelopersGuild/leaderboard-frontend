module.exports = function (grunt) {

  var path = require("path");

  // Project configuration.
  grunt.initConfig({

    /**
     * Load package.json
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Concat-in-Order - Concatinate files in order based on their dependencies (@depend ./path/to/file.js)
     */

    concat_in_order: {
      main: {
        files: {
            'build/<%= pkg.name %>.js': ['src/concat/head.js', '<%= pkg.main %>', 'src/concat/tail.js']
        },
        options: {
            extractRequired: function(filepath, filecontent) {
                var workingdir = path.normalize(filepath).split(path.sep);
                workingdir.pop();

                var deps = this.getMatches(/\*\s*@depend\s(.*\.js)/g, filecontent);
                deps.forEach(function(dep, i) {
                    var dependency = workingdir.concat([dep]);
                    deps[i] = path.join.apply(null, dependency);
                });
                return deps;
            },
            extractDeclared: function(filepath) {
                return [filepath];
            },
            onlyConcatRequiredFiles: true
        }
      }
    },

    /**
     * Uglify - Minify and obfuscate
     */
    uglify: {
      build: {
        options: {
          banner: '/*! <%= pkg.name %> ©<%= grunt.template.today("yyyy") %> - <%= pkg.homepage %> */'
        },
        files: {
          'dist/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
        }
      }
    },

    /**
     * Mocha - Unit Tests
     */

    mochacli: {
      /*options: {
        reporter: 'spec',
        require: ['should'],

        project: {
          src: ['test/**\/*.spec.js']
        }
      }*/
      options: {
            require: ['should'],
            reporter: 'spec',
            bail: true
        },
        all: ['test/*.js']
    },

    /*
    mochacli:
      options:
        reporter:                 'spec'                                      # This report is nice and human-readable
        require:                  ['should']                                  # Run the tests using Should.js
        compilers:                ['coffee:coffee-script/register']

      # Targets

      project:                    # Run the project's tests
        src:                      ['<%= tstFiles %>']
     */

    /**
     * Clean - Clean the target files & folders, deleting anything inside
     */

    clean: {
      build: ['build/**/*.js'],
      dist:  ['dist/**/*.js']
    },

    /**
     * Watch - Run tasks on filesystem changes
     */

    watch: {
      options: {
        tasks: ['build:dev'],
        interrupt: true,
        atBegin: true
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['build:dev']
      },
      project: {
        files: ['src/**/*.js', 'test/**/*.spec.js'],
        tasks: ['build:dev']
      }
    }


  });

  // Loads all grunt tasks from devDependencies starting with "grunt-"
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['build']);

  grunt.registerTask('test', ['mochacli']);

  grunt.registerTask('build', ['build:dev']);
  grunt.registerTask('build:dev', ['test', 'clean:build', 'concat_in_order:main']);
  grunt.registerTask('build:dist', ['test', 'clean:build', 'clean:dist', 'concat_in_order:main', 'uglify:build']);

}
