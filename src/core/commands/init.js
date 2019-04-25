var exec = require('child_process').exec,child;

function mkdir(){
    cmd = 'sh ../../bin/create.sh'

    child = exec(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })
}
