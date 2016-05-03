/*
This file is part of Project Tiresias.

Project Tiresias is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Project Tiresias is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Project Tiresias.  If not, see <http://www.gnu.org/licenses/>.
*/

parseMATLABExpr = function(equation) {
	tokenList = tokenizeMATLAB(parseExpr)
	if(!tokenList) return false
	return parseMATLABTokenList(tokenList)
}

getCatcode = function(character) {
	switch(character) {
		case "\\": return 0;
		case "{": return 1;
		case "}": return 2;
		case "$": return 3;
		case "&": return 4;
		case "\n": return 5;
		case "#": return 6;
		case "^": return 7;
		case "_": return 8;
		case "\0": return 9;
		case " ":
		case "\t": return 10;
		case "~": return 13;
		case "%": return 14;
		default:
			if(/[a-zA-Z]/.exec(character)) return 11;
			return 12;
	}
}

tokenizeMATLAB = function(equation) {
	var tokenList = []
	for(var i = 0; i < equation.length; i++) {
		switch(this.getCatcode(equation[i])) {
			case 0:
				var cmdName = ""
				i++
				for(;i < equation.length && this.getCatcode(equation[i]) == 11; i++) {
					cmdName += equation[i]
					i++
				}
				tokenList.push({type: "command", name: cmdName})
				break
			case 1:
				tokenList.push({type: "beginGroup"})
				break
			case 2:
				tokenList.push({type: "endGroup"})
				break
			case 5:
			case 10:
				break
			case 7:
				tokenList.push({type: "superscript"})
				break
			case 8:
				tokenList.push({type: "subscript"})
				break
			case 9: break
			case 13:
				tokenList.push({type: "command", name: equation[i]})
				break
			case 14:
				i++
				for(;i < equation.length && this.getCatcode(equation[i]) != 5; i++);
				break
			default:
				return false
		}
	}
	return tokenList
}

parseMATLABTokenList = function(tokenList) {
	
}
