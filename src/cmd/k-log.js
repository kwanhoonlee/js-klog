#!/usr/bin/env node

var program = require('commander');
var add = require('../core/commands/add')
 
program
  .version('0.1.0')
  .usage('[commands] [options]' )
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook');
 
program
  .command('add [filename]')
  .description('encodes file and adds encoded file to k-log cluster')
  .action(function(filename, options){
    add.commandAdd(filename)
  });
 
program
  .command('exec <cmd>')
  // .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  }).on('--help', function() {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $ deploy exec sequential');
    console.log('  $ deploy exec async');
  });
 
program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });
 
program.parse(process.argv);
