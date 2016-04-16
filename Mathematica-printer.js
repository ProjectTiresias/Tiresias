/*
 * We print Mathematica code in StandardForm
 */
function printMathematicaExpr(AST) {
	switch(AST.type) {
    case "combinator":
    	switch(AST.subType) {
    		case "integral":
    			// TODO: take care of case with no upperLimit and/or lowerLimit
    			return ("Integrate[" + printMathematicaExpr(AST.contents) + ",{" 
    				+ printMathematicaExpr(AST.variable) + "," + printMathematicaExpr(AST.minLimit)
    				+ "," + printMathematicaExpr(AST.maxLimit) + "}]");
    		case "sum":
    			// TODO: take care of case with no upperLimit and/or lowerLimit
    			return ("Sum[" + printMathematicaExpr(AST.contents) + ",{" 
    				+ printMathematicaExpr(AST.variable) + "," + printMathematicaExpr(AST.minLimit)
    				+ "," + printMathematicaExpr(AST.maxLimit) + "}]");
    		case "product":
    			// TODO: take care of case with no upperLimit and/or lowerLimit
    			return ("Product[" + printMathematicaExpr(AST.contents) + ",{" 
    				+ printMathematicaExpr(AST.variable) + "," + printMathematicaExpr(AST.minLimit)
    				+ "," + printMathematicaExpr(AST.maxLimit) + "}]");
    		case "lim":
    			return ("Limit[(" + printMathematicaExpr(AST.contents) + ")," 
    				+ printMathematicaExpr(AST.variable) + "->" 
    				+ printMathematicaExpr(AST.minLimit) + "]");
    		default:
    			// TODO: error for unknown subType of combinator
    	}
        break;

    case "function":
    	//TODO: Stuff
    	//for each thing in argument list, 
    	var functionArgs = "";
    	if (AST.argument.length > 0) {
	    	AST.argument.foreach(function(arg){
	    		functionArgs + printMathematicaExpr(arg) + ",";
	    	});
	    	// remove extra "," at end of functionArgs
    		functionArgs = functionArgs.substring(0,functionArgs.length - 2);
    	}
        return AST.name + "[" +  functionArgs	 + "]";
        break;
    case "constant":
    	return AST.value;
        break;
    case "latin":
    	return AST.name;
        break;
    case "greek":
    	return AST.name;
        break;
    case "relational":
        switch(AST.subType) {
			case "==": 
				return "(" + printMathematicaExpr(AST.LHS) + ")==(" + printMathematicaExpr(AST.RHS) + ")";
			case "<":
				return "(" + printMathematicaExpr(AST.LHS) + ")<(" + printMathematicaExpr(AST.RHS) + ")";
			case ">":
				return "(" + printMathematicaExpr(AST.LHS) + ")>(" + printMathematicaExpr(AST.RHS) + ")";
			case "<=":
				return "(" + printMathematicaExpr(AST.LHS) + ")<=(" + printMathematicaExpr(AST.RHS) + ")";
			case ">=":
				return "(" + printMathematicaExpr(AST.LHS) + ")>=(" + printMathematicaExpr(AST.RHS) + ")";
			case "!=":
				return "(" + printMathematicaExpr(AST.LHS) + ")!=(" + printMathematicaExpr(AST.RHS) + ")";
			case "approx": 
				return "TildeTilde[" + printMathematicaExpr(AST.LHS) + "," + printMathematicaExpr(AST.RHS) + "]";
			default:
				// not supported in Mathematica
				break;
		}
        break;
    case "binaryOperator":
		switch(AST.subType) {
			case "implicitMultiply":
				return ("(" + printMathematicaExpr(AST.leftOp) + ") (" 
					+ printMathematicaExpr(AST.rightOp) + ")"); 
			case "*":
				return ("(" + printMathematicaExpr(AST.leftOp) + ")*(" 
					+ printMathematicaExpr(AST.rightOp) + ")"); 
			case "+":
				return ("(" + printMathematicaExpr(AST.leftOp) + ")+(" 
					+ printMathematicaExpr(AST.rightOp) + ")"); 
			case "-":
				return ("(" + printMathematicaExpr(AST.leftOp) + ")-(" 
					+ printMathematicaExpr(AST.rightOp) + ")"); 
			case "/":
				return ("(" + printMathematicaExpr(AST.leftOp) + ")/(" 
					+ printMathematicaExpr(AST.rightOp) + ")"); 
			case "^":
				return ("Exponent[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]"); 
			case "%":
				return ("Mod[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]"); 
			case "cross":
				return ("Cross[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]"); 
			case "dot":
				return ("(" + printMathematicaExpr(AST.leftOp) + ").(" 
					+ printMathematicaExpr(AST.rightOp) + ")"); 
			case "+/-":
				return ("PlusMinus[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]"); 
			case "-/+":
				return ("MinusPlus[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]"); 
			case "subscript":
				return ("Subscript[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]");  
			case "superscript":
				return ("Superscript[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]"); 
			case "nthroot":
				// rightOp = argument
				// Note: square root is a unary operator
				return ("Surd[" + printMathematicaExpr(AST.rightOp) + "," 
					+ printMathematicaExpr(AST.leftOp) + "]"); 
			case "union":
				return ("Union[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]");  
			case "intersect":
				return ("Intersection[" + printMathematicaExpr(AST.leftOp) + "," 
					+ printMathematicaExpr(AST.rightOp) + "]"); 
			default:
				// TODO: error for unknown subType of binary Operator
		}
		break;
    case "unaryOperator":
    	//TODO: Stuff
    	switch(AST.subType) {
    		case "not":
    			return "Not[" + printMathematicaExpr(AST.operand) + "]";
    		case "-":
    			return "Negative[" + printMathematicaExpr(AST.operand) + "]";
    		case "+/-":
    			return "PlusMinus[" + printMathematicaExpr(AST.operand) + "]";
    		case "-/+":
    			return "MinusPlus[" + printMathematicaExpr(AST.operand) + "]";
    		case "factorial":
    			return "(" + printMathematicaExpr(AST.operand) + ")!";
    		case "sqrt":
    			return "Sqrt[" + printMathematicaExpr(AST.operand) + "]";
    		default:
    			// TODO: error for unknown subType of unary operator
    	}
        break;
    case "fraction":
    	//TODO: Stuff
    	return ("FractionBox[\"" + printMathematicaExpr(AST.numerator) 
    		+ "\",\"" + printMathematicaExpr(AST.denominator) + "\"]");
    case "grouping":
    	// TODO: should we check if contents are empty?
    	if (((AST.openingSymbol === "(") || (AST.openingSymbol === "[") 
    		|| (AST.openingSymbol === "{")) 
    		&& ((AST.closingSymbol === ")") || (AST.closingSymbol === "]") 
    		|| (AST.closingSymbol === "}") )) {
				return "(" + printMathematicaExpr(AST.contents) + ")";
    		} 
    	if ((AST.openingSymbol === "|") && (AST.closingSymbol === "|"))
    		return "Abs[" + printMathematicaExpr(AST.contents) + "]";
		
    	else {
    		// Error for unrecognized grouping symbol
    	}
    		
        break;
    case "trig":
    	var trigFunction = "";
    	var startIndex = 0;
    	if (AST.operator.length > 4) {
			trigFunction += "Arc";
			startIndex = 3 
    	}
    	var firstLetter = AST.operator.substring(startIndex,startIndex+1);
    	var tail = AST.operator.substring(startIndex+1);
    	trigFunction += firstLetter + tail; 
    	return trigFunction + "[" + printMathematicaExpr(AST.argument) + "]";

    default:
        // TODO: error "Not a AST"
	}
}
