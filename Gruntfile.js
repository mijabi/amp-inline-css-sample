module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    paths: {
      scss: [
        'dev/sass/**/*.scss'
      ],
      css: [
        'dev/css/pulp.css'
      ]
    },

    compass: {
      dev: {
        options: {
          config: 'config.rb'
        }
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'dev/css/',
        src: ['**/*.css', '!**/*.min.css'],
        dest: 'dist/css/',
        ext: '.min.css',
        options: {
          noAdvanced: true,
        }
      }
    },

    copy: {
      html: {
        expand: true,
        flattn: false,
        cwd: 'assemble/',
        src: '**/*.html',
        dest: 'dist/'
      },
      css: {
        expand: true,
        flattn: false,
        cwd: 'dev/',
        src: 'css/**/*.css',
        dest: 'dist/'
      },
      img: {
        expand: true,
        flattn: false,
        cwd: 'dev/',
        src: 'img/**/*',
        dest: 'dist/'
      }
    },

    assemble: {
      site: {
        options: {
          layoutdir: 'dev/assemble-layouts', // 各ページのYFMで指定するレイアウトファイル（layout:）設置場所のパス
          data: ['dev/assemble-datas/**/*.{json,yml}'], // 各hbsファイルから変数として呼び出すファイル群の指定
          partials: ['dev/assemble-includes/**/*.hbs'], // 各hbsファイルから呼び出すテンプレートhtml（.hbs）ファイルを指定
          flatten:  false, // true にすると、生成するファイル群からディレクトリパスを削除
          helpers: [
            'handlebars-helper',
            'handlebars-helper-prettify',
            'handlebars-helper-minify'
          ],
          prettify: {
            condense: true,
            indent_char: '  ',
            indent: 1,
            unformatted: ['br']
          },
          minify: {
            removeAttributeQuotes: false
          }
        },
        expand: true,
        dest: 'dist/', // 生成するファイルの保存先
        cwd: 'dev/assemble', // ここで指定したディレクトリ配下は、生成後にディレクトリ構造が保持される。expand: true にする必要がある
        src: ['**/*.hbs'] // 監視対象ファイル
      },
      component: {
        options: {
          data: 'assemble-datas/general.json'
        }
      }
    },

    critical: { // pulp.min.css から、ページで利用しているセレクタのみを inline css として記述
      dist: {
        options: {
          base: './',
          css: ['dist/css/pulp.min.css'], //  css 指定しないと必ずエラー
          extract: true,
          inline: true,
          minify: true,
          width: 320,
          height: 10000
        },
        src: '**/*.amp.html',
        dest: ''
      }

    },

    'string-replace': {
      dist: {
          overwrite: true,
        files: [{
          expand: true,
          cwd: 'dist/',
          src: '**/*.amp.html',
          dest: 'dist/'
        }],
        options: {
          overwrite: true,
          replacements: [
            {
              pattern: /<style type=\"text\/css\">/g,
              replacement: '<style amp-custom>'
            }, {
              pattern: /amp=\"\"/i,
              replacement: 'amp'
            }, {
              pattern: / amp-boilerplate=\"\"/g,
              replacement: ' amp-boilerplate'
            }, {
              pattern: /@charset \"UTF-8\";/g,
              replacement: ''
            }, {
              pattern: /@-ms-viewport{width:device-width}/g,
              replacement: ''
            }, {
              pattern: /@viewport{width:device-width}/g,
              replacement: ''
            }, {
              pattern: /!important/g,
              replacement: ''
            }
          ]
        }
      }

    }

  });


  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks('grunt-contrib-cssmin');


  grunt.registerTask('css', ['compass', 'cssmin', 'copy:css']);
  grunt.registerTask('img', ['copy:img']);
  grunt.registerTask('html', ['assemble']);
  grunt.registerTask('amp', ['critical', 'string-replace:dist']);

};
