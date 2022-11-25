const commands= require("./commands");

function done(output){
  process.stdout.write(output);
  process.stdout.write("\nprompt > ");
}

process.stdout.write('prompt > ');
    // El evento stdin 'data' se dispara cuando el user escribe una línea
process.stdin.on('data', function (data) {
  const userInput =data.toString().trim().split(" ");
  const cmd = userInput.shift();
  const args= userInput.join(" ");

  if(commands[cmd]) commands[cmd](done, args);
  else done("You typed: " +cmd);

});