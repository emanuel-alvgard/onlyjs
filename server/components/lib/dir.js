let fs = require('fs');

// @DONE
// @MOVE into util
function array_assign(source, target) {
    target.splice(0, target.length);
    for (let i = 0; i < source.length; i++) {
        target.push(source[i]);
    }
    return;
}


// @DONE
exports.collect = (target_dir, extension, excluded, files=[], ino=[], mod=[], trail="") => {
    
    let _trail = target_dir + "/" 
    let dir = fs.readdirSync(target_dir);

    for (let i = 0; i < dir.length; i++) {
        
        if (excluded.includes(dir[i])) { continue; }
        if (dir[i].includes(".") === false) { exports.collect(target_dir + "/" + dir[i], extension, excluded, files, ino, mod, _trail); }
        else if (dir[i].includes(extension)) { // optimize to look at extension from end of string
            let stats = fs.statSync(target_dir + "/" + dir[i])
            files.push(_trail + dir[i]);
            ino.push(stats.ino);
            mod.push("" + stats.mtimeMs);
        }
    }
}

// @NOT @HERE
exports.watch = (start_path, extension, excluded, interval, func) => {

    execute = 0;

    let prev_ino = [];
    let prev_mod = [];
    
    let ino = [];
    let mod = [];

    setInterval(function() {

        exports.collect(start_path, extension, excluded, [], ino, mod)

        // COMPARE
        for (let i = 0; i < ino.length; i++) {
            let index = prev_ino.indexOf(ino[i]);
            if (index === -1) { execute = 1; }
            else if (prev_mod[index] !== mod[i]) { execute = 1; }
        }

        // EXECUTE
        if (execute === 1) { func(); }
        
        // CLEAR
        array_assign(ino, prev_ino);
        ino.splice(0, ino.length);
        array_assign(mod, prev_mod);
        mod.splice(0, mod.length);

        execute = 0;
    
    }, interval);
}
