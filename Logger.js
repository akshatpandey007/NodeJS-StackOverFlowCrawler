import fs from "fs";

export default function loz(...args) {
  const temp = "LoZ : " + args.join(" ") + "\n";
  fs.appendFile("./Logging.txt", temp, (err) => {
    if (err) console.log("Loz error : ", err);
  });
}

export function stateLoz(...args) {
  const temp = "StateLoz : " + args.join(" ") + "\n";
  fs.appendFile("./StateLogging.txt", temp, (err) => {
    if (err) console.log("State Logger Error", err);
  });
}
