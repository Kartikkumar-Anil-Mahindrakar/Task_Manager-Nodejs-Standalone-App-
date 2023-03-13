const yargs = require('yargs');
const fs = require('fs');

const data = 'Hello, world!';
//appending file
const addTask = (data)=>{
    fs.appendFile('task.txt', data, (err) => {
        if (err) {
          console.error(err);
        }
      });
}

const deleteTask = (index)=>{
    // const data = priority+" "+message+"\n";
    fs.readFile("task.txt", "utf-8", (err, data) => {
        const simple = simplify(data);
        let sendData = '';
        let bool = false;
        simple.forEach((ele,idx)=>{
            if(idx !== index-1){
                sendData += ele.priority+" "+ele.message+"\n";
            }else{
                bool = true;
            }
        });
        if(!bool){
            console.log(`StringContaining "Error: task with index #${index} does not exist. Nothing deleted."`);
            return;
        }
        fs.writeFile('task.txt',sendData,(err)=>{
            if(err){
                console.log(err);
            }
        })
        
        console.log('Deleted task #'+index)
        
    })
}

const markAsDone = (index)=>{
    // const data = priority+" "+message+"\n";
    fs.readFile("task.txt", "utf-8", (err, data) => {
        const simple = simplify(data);
        const complete = {...simple[index-1]};
        let sendData = '';
        let bool = false;
        simple.forEach((ele,idx)=>{
            if(idx !== index-1){
                sendData += ele.priority+" "+ele.message+"\n";
            }else{
                bool = true;
            }
        });
        if(!bool){
            console.log(`StringContaining "Error: no incomplete item with index #${index} exists."`);
            return;
        }
        fs.writeFile('task.txt',sendData,(err)=>{
            if(err){
                console.log(err);
            }
        })
        fs.appendFile("completed.txt",complete.message+"\n",(err)=>{
            if(err){
                console.log(err);
            }
        })
        console.log('Marked item as done.')
        
    })
}

//reading file 
// fs.readFile("task.txt", "utf-8", (err, data) => {
//     console.log(data);
//   });

const completedTask = ()=>{
    let task = '';
    fs.readFile("completed.txt", "utf-8", (err, data) => {
        task = data;
    });
    // const ok = task.split
    return task;
}
const showList = ()=>{
    fs.readFile("task.txt", "utf-8", (err, data) => {
        
        const simple = simplify(data);
        if(simple.length === 0){
            console.log('StringContaining "There are no pending tasks!"')
            return;
        }
        simple.forEach((ele,idx)=>{
            console.log(  (idx+1)+". "+ele.message+" ["+ele.priority+"]");
            bool = false;
        }); 
        
    })
}

const showReport = ()=>{
    
    fs.readFile("task.txt", "utf-8", (err, data) => {
        
        const simple = simplify(data);
        console.log('Pending : '+simple.length);
        simple.forEach((ele,idx)=>{
            console.log((idx+1)+". "+ele.message+" ["+ele.priority+"]");
        }); 
        console.log("");
        
        fs.readFile("completed.txt", "utf-8", (err, data) => {

            if(!data){
                console.log("Completed : "+0);
                return;
            }
            const ok = data.split("\n").slice(0,-1);
            console.log("Completed : "+ok.length);
            ok.forEach((ele,idx)=>{
                console.log((idx+1)+". "+ele)
            })
        });
    });
    
            // console.log(completeTask);
}
const simplify = (data)=>{
    if(!data){
        return [];
    }
    let ok = data.split("\n").slice(0,-1).map((ele,idx)=>{
        const index = ele.indexOf(" ");
        const str = [ele.slice(0,index),ele.slice(index)];
        return {priority:str[0],message:str[1]};
    }).sort((a,b)=>{
        return a.priority-b.priority;
    });
    
    return ok;
}


yargs
    .command({
        command:'add',
        describe:'add a note',
        handler: (argv)=>{
            if(argv._.length === 0 || (typeof argv._[2]) !== 'string'){
                console.log('StringContaining "Error: Missing tasks string. Nothing added!"')
                return;
            }
            const priority = argv._[1];
            const message = argv._[2];
            const data = priority+" "+message+"\n";
            addTask(data);
            console.log(`Added task: "${message}" with priority ${priority}`);
        }
    })
    .command({
        command:'done',
        describe:'Mark Task as done',
        handler: (argv)=>{
            if(argv._.length === 1 || (typeof argv._[1]) !== 'number'){
                console.log('StringContaining "Error: Missing NUMBER for marking tasks as done."')
            }else{
                markAsDone(argv._[1])
            }  
        }
    })
    .command({
        command:'del',
        describe:'Delete Task ',
        handler: (argv)=>{

            if(argv._.length === 1 || (typeof argv._[1]) !== 'number'){
                console.log('StringContaining "Error: Missing NUMBER for deleting tasks."')
            }else{
                deleteTask(argv._[1])
            }  
        }
    })
    .command({
        command:'ls',
        describe:'Show incomplete priority list',
        handler: ()=>{
            showList();
        }
    })
    .command({
        command:'report',
        describe:'Statistics',
        handler:  ()=>{
            showReport();
        }
    })
    .command({
        command:['*','help'],
        handler: (argv)=>{
            console.log("Usage :-");
            console.log('$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list')
            console.log('$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order')
            console.log('$ ./task del INDEX            # Delete the incomplete item with the given index')
            console.log('$ ./task done INDEX           # Mark the incomplete item with the given index as complete')
            console.log('$ ./task help                 # Show usage')
            console.log('$ ./task report               # Statistics')
            
        },
}).help(false).argv;