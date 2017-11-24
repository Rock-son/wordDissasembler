"use strict"
const words = require("./words");

module.exports.getWords = function(alphabet) {

    const escapeStr = new RegExp(/[\W]/, "g");
    if (escapeStr.test(alphabet)) {return ["There was an error"];}

    const abcLen = alphabet.length;

    return words.filter((word) => {
        const len = word.indexOf(/\s/) > -1 ? word.length - 1 : word.length;
        if (len > abcLen || len < 5) {return false;}

        return isWholeWordInside(word, alphabet);
    }).sort((a, b) => b.length - a.length);
}


function isWholeWordInside(word, alphabet) {

    let tempWord = word.replace(/\s | \( | \) | \-|\'/g, "").split(""); // e.g. "de facto" => ['d','e','f','a','c','t','o']

    const result = alphabet.split("")
                           .filter(function(char) {

                                    const matchIndex = tempWord.indexOf(char);
                                    if (matchIndex > -1)  {
                                        tempWord.splice(matchIndex, 1);
                                        return true;
                                    } else {
                                        return false;
                                    }   
    });
    return tempWord.length === 0;
}